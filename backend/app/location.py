# app/location.py

import httpx

OVERPASS_URL = "https://overpass-api.de/api/interpreter"


async def find_dermatologists(lat, lng):

    # Search within 5km radius for a variety of medical place tags
    query = f'''
    [out:json];
    (
      node["amenity"="doctors"](around:5000,{lat},{lng});
      way["amenity"="doctors"](around:5000,{lat},{lng});
      relation["amenity"="doctors"](around:5000,{lat},{lng});

      node["amenity"="clinic"](around:5000,{lat},{lng});
      way["amenity"="clinic"](around:5000,{lat},{lng});
      relation["amenity"="clinic"](around:5000,{lat},{lng});

      node["amenity"="hospital"](around:5000,{lat},{lng});
      way["amenity"="hospital"](around:5000,{lat},{lng});
      relation["amenity"="hospital"](around:5000,{lat},{lng});

      node["healthcare"="clinic"](around:5000,{lat},{lng});
      way["healthcare"="clinic"](around:5000,{lat},{lng});
      relation["healthcare"="clinic"](around:5000,{lat},{lng});

      node["speciality"="dermatology"](around:5000,{lat},{lng});
      way["speciality"="dermatology"](around:5000,{lat},{lng});
      relation["speciality"="dermatology"](around:5000,{lat},{lng});
    );
    out center;
    '''

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(OVERPASS_URL, data=query, timeout=10.0)
            data = response.json()
    except Exception:
        return []

    candidates = []

    for element in data.get("elements", []):
        tags = element.get("tags", {})

        name = tags.get("name") or tags.get("operator") or "Unknown Clinic"

        # collect possible speciality tags
        speciality = (
            tags.get("healthcare:speciality") or
            tags.get("speciality") or
            tags.get("medical_specialty") or
            ""
        )

        description = tags.get("description", "")

        # Combine text to search for dermatology keywords
        search_text = " ".join([str(name), str(speciality), str(description)])

        is_derm = False
        lower_search = search_text.lower()
        if any(k in lower_search for k in ["derm", "dermat", "skin"]):
            is_derm = True

        address = ", ".join(filter(None, [tags.get("addr:street", ""), tags.get("addr:city", ""), tags.get("addr:postcode", "")]))

        candidates.append({
            "name": name,
            "speciality": speciality,
            "address": address,
            "is_derm": is_derm,
            # include distance or id if needed
        })

    # Prefer entries marked as dermatology, otherwise return nearby clinics/doctors
    derms = [c for c in candidates if c["is_derm"]]
    if derms:
        return derms[:5]

    # fallback: return up to 5 closest candidates (no sorting by distance available here)
    return candidates[:5]
