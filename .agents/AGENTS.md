# Workspace Agent Rules

## Data Handling & Mapping
- Always prefer standardized identifiers (e.g., ISO-3 codes for countries, UUIDs for entities) over raw string names when mapping data between different sources (like a database and a GeoJSON file) to prevent silent failures.

## UI Transparency
- Any data presented in the UI that is simulated, randomly generated, or mocked must be explicitly labeled (e.g., with a "SIMULATED" badge) to ensure users are not misled about data integrity.
