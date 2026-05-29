# API Contract — FrameMatch
# This file is the single source of truth shared between the iOS agent and the backend agent.
# Neither agent may modify this file unilaterally.
# Any change must be reflected in both AGENTS.md files before implementation.

---

## Endpoint

```
POST https://backend-five-chi-33.vercel.app/api/analyze
```

Replace `your-vercel-url` with your actual Vercel deployment URL after Branch 1 is deployed.

---

## Request

**Content-Type:** `application/json`

```json
{
  "referenceImage": "<base64 string>",
  "liveFrame":      "<base64 string>",
  "language":       "en"
}
```

### Field Rules

| Field          | Type   | Required | Notes                                        |
|----------------|--------|----------|----------------------------------------------|
| referenceImage | string | Yes      | Base64-encoded JPEG or PNG, no data URI prefix |
| liveFrame      | string | Yes      | Base64-encoded JPEG or PNG, no data URI prefix |
| language       | string | Yes      | Always `"en"` in v1                          |

---

## Response — Success 200

```json
{
  "photographer": "Step back slightly",
  "subject":      "Turn left shoulder",
  "matchScore":   73
}
```

### Response Field Rules

| Field        | Type    | Notes                                              |
|--------------|---------|----------------------------------------------------|
| photographer | string  | Instruction for the person holding the camera      |
| subject      | string  | Instruction for the person being photographed      |
| matchScore   | integer | 0–100, estimated by GPT-4o, supplementary only     |

---

## Response — Error

```json
{
  "error": "<human-readable description>"
}
```

| Status | Meaning                                   |
|--------|-------------------------------------------|
| 400    | Missing or invalid fields in request body |
| 500    | Internal server error                     |

---

## Instruction Constraints

These constraints are **enforced by the backend** and **trusted by iOS**.
iOS must still truncate to INSTRUCTION_MAX_CHARS as a safety net.

| Rule                  | Value                                       |
|-----------------------|---------------------------------------------|
| Max characters        | 18 English characters per field (trim first) |
| Language              | English only                                |
| Lines                 | Single sentence, no line breaks             |
| Banned words          | See list below                              |

### Banned Words (case-insensitive)

```
focal length
aperture
rule of thirds
bokeh
exposure
ISO
shutter speed
depth of field
composition
```

None of these words may appear in `photographer` or `subject` fields.

---

## matchScore Notes

- Integer 0–100
- Provided by GPT-4o as a rough estimate
- **iOS uses Apple Vision IoU as the primary match score**, not this value
- This field is supplementary — used for logging and future analytics only
- If GPT-4o does not return a parseable integer, backend returns `0`

---

## Fallback Response

Returned when all retries are exhausted or an unrecoverable error occurs.
iOS must handle this gracefully (display fallback text, do not crash).

```json
{
  "photographer": "Adjust camera",
  "subject":      "Hold position",
  "matchScore":   0
}
```

---

## Error Handling Behaviour (Backend Responsibility)

| Scenario                        | Backend action                          |
|---------------------------------|-----------------------------------------|
| Missing `referenceImage`        | Return 400 `{ error: "Missing required fields" }` |
| Missing `liveFrame`             | Return 400 `{ error: "Missing required fields" }` |
| Invalid base64 string           | Return 400 `{ error: "Invalid image data" }` |
| GPT-4o timeout > 5s             | Return fallback with 200, do NOT return 500 |
| Instruction fails validation    | Retry once with strict prompt, then return fallback |
| Any other unexpected error      | Return 500 `{ error: "Internal server error" }` |

---

## Retry Logic (Backend Responsibility)

1. First attempt: call GPT-4o with `buildPrompt()`
2. Run `validateInstructions()` on result
3. If validation fails: call GPT-4o again with `buildStrictPrompt()`
4. Run `validateInstructions()` on second result
5. If still fails: return fallback response
6. **Maximum 2 GPT-4o calls per request**

---

## iOS Networking Spec (iOS Responsibility)

| Property         | Value                                               |
|------------------|-----------------------------------------------------|
| Method           | POST                                                |
| Timeout          | 5 seconds                                           |
| Image encoding   | JPEG, compression quality 0.5, base64 string        |
| Call frequency   | Once every `Constants.API_CALL_INTERVAL` (2.0 seconds) |
| On any error     | Use fallback values, do not crash or show error UI  |
| On success       | Truncate fields to `Constants.INSTRUCTION_MAX_CHARS` (18) before display |

---

## Constants Reference

These values are defined in `Constants.swift` on iOS and must be consistent with this contract.

```swift
static let API_CALL_INTERVAL: TimeInterval = 2.0
static let INSTRUCTION_MAX_CHARS = 18
```

---

## Versioning

- **Current version:** v1
- No version header required in requests
- If this contract changes:
  1. Update this file first
  2. Notify the backend agent (update `/backend/AGENTS.md`)
  3. Notify the iOS agent (update `/ios/FrameMatch/AGENTS.md`)
  4. Both sides must be updated before any code changes begin
