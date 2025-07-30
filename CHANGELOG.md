# Changelog

## [2.5.0] - 2025-07-30

### Improved
- Optimized CSS performance
  - Added will-change property for transform optimization
  - Improved touch handling with touch-action
  - Added contain property for better rendering performance
  - Added Safari support for backdrop-filter
  - Updated version number in navbar to v2.1.0

## [2.0.0] - 2025-07-30

### Added
- Dynamic cube lighting system
  - Second layer cubes now emit light when outer neighbors move
  - Point lights automatically added for every 4th activated cube
  - Optimized performance using object pooling for lights
  - Smart neighbor detection system using grid indexing

### New Features
- Toolbox controls for lighting:
  - Emissive color picker for cube glow
  - Emissive intensity slider (0-2)
  - Point light intensity slider (0-2)

### Technical Improvements
- Added `cubeLighting.js` with CubeLightingManager class
- Implemented efficient neighbor detection system
- Optimized performance with:
  - Pre-allocated light pool
  - Material caching
  - Smart cube filtering by layer
  - Efficient grid-based neighbor lookups

### Files Changed
- Added: `js/objects/cubeLighting.js`
- Modified: 
  - `js/ui/toolbox.js` (added lighting controls)
  - `js/objects/cubes.js` (added neighbor detection and lighting updates)
  - `script.js` (integrated lighting updates in animation loop)
  - Added cube lighting controls to HTML

### Performance Considerations
- Uses object pooling to prevent garbage collection
- Only processes relevant outer and second layer cubes
- Efficient neighbor lookups using grid indexing
- Material and light caching to minimize object creation
