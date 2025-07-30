# 3D Interactive Cube Grid

## Version 2.0.0

An interactive 3D cube grid with dynamic lighting effects built using Three.js.

## Features

### Core Features
- Interactive 3D cube grid
- Dynamic movement and physics
- Customizable fog and background
- Inner cube toggle functionality

### New in 2.0.0
- Dynamic lighting system
  - Second layer cubes emit light when outer neighbors move
  - Automatic point lights for every 4th activated cube
  - Customizable lighting controls:
    - Emissive color
    - Emissive intensity
    - Point light intensity

## Technical Details

### Performance Optimizations
- Object pooling for lights
- Efficient neighbor detection using grid indexing
- Material and light caching
- Smart filtering of relevant cubes by layer

### Architecture
- Modular JavaScript structure
- Event-driven interaction system
- Optimized rendering pipeline
- Customizable through toolbox interface

## Setup and Usage

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/3D-site-v1.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Controls

### Toolbox Controls
- Toggle inner cubes
- Adjust fog settings
- Change background color
- Modify cube opacity
- Control lighting effects:
  - Emissive color picker
  - Emissive intensity slider
  - Point light intensity slider

### Mouse Controls
- Click and drag to move cubes
- Orbit controls for camera movement

## Development

### Project Structure
```
├── js/
│   ├── core/
│   │   ├── controls.js
│   │   ├── lights.js
│   │   ├── scene.js
│   │   └── SceneManager.js
│   ├── objects/
│   │   ├── cubeLighting.js
│   │   ├── cubes.js
│   │   └── floor.js
│   └── ui/
│       └── toolbox.js
├── script.js
└── style.css
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
