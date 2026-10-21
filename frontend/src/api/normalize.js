// Different backends wrap list responses differently — a bare array,
// { data: [...] }, { applications: [...] }, { students: [...] },
// { jobs: [...] }, or { success, ...  } with the list under some other
// key. Rather than assume one shape (and crash with "x.map is not a
// function" when it's wrong), this pulls out the first array it finds.
export function asArray(payload) {
  if (Array.isArray(payload)) return payload

  if (payload && typeof payload === 'object') {
    for (const value of Object.values(payload)) {
      if (Array.isArray(value)) return value
    }
  }

  return []
}

// Some backends send a reference field (like "company") as a plain
// string, others send it "populated" — a full object such as
// { _id, name, email }. Rendering that object directly crashes React
// ("Objects are not valid as a React child"), so this pulls out a
// sensible display string from either shape.
export function displayText(value, fallback = '') {
  if (value === null || value === undefined) return fallback
  if (typeof value === 'string' || typeof value === 'number') return value
  if (typeof value === 'object') return value.name || value.title || value.email || fallback
  return fallback
}
