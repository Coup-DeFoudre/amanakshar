# Draco Decoder Files

This directory contains the Draco 3D data compression decoder files used by Three.js for loading compressed GLTF/GLB models.

## What is Draco?

Draco is an open-source library for compressing and decompressing 3D geometric meshes and point clouds. It was developed by Google and can significantly reduce the size of 3D model files.

### Benefits

- **Smaller File Sizes**: Up to 90% compression for mesh geometry
- **Faster Loading**: Reduced download times for 3D models
- **Quality Preservation**: Lossless or near-lossless compression
- **Wide Support**: Supported by major 3D tools and frameworks

## Required Files

To use Draco compression, download these files from the Three.js repository:

1. `draco_decoder.js` - JavaScript decoder
2. `draco_decoder.wasm` - WebAssembly decoder (faster)
3. `draco_wasm_wrapper.js` - WASM wrapper

### Download Location

Get the files from:
```
https://github.com/mrdoob/three.js/tree/dev/examples/jsm/libs/draco
```

Or use the npm package:
```bash
npm install draco3d
```

Then copy the decoder files:
```bash
cp node_modules/draco3d/draco_decoder.js public/draco/
cp node_modules/draco3d/draco_decoder.wasm public/draco/
cp node_modules/draco3d/draco_wasm_wrapper.js public/draco/
```

## Usage

The Draco loader is automatically configured in the 3D system:

```tsx
import { loadGLTFModel } from '@/components/3d'

// Models with Draco compression are automatically decoded
const gltf = await loadGLTFModel('/models/compressed-model.glb', {
  useDraco: true
})
```

## Compressing Models

### Using Blender

1. Export as GLTF/GLB
2. Enable "Compression" in export settings
3. Set compression level (0-10)

### Using gltf-pipeline

```bash
npm install -g gltf-pipeline

# Compress a GLB file
gltf-pipeline -i input.glb -o output.glb --draco.compressionLevel 7
```

### Using gltfpack

```bash
# More aggressive compression with gltfpack
gltfpack -i input.glb -o output.glb -tc
```

## Compression Guidelines

| Content Type | Recommended Level | Notes |
|-------------|-------------------|-------|
| Architectural | 7-10 | Large, simple geometry |
| Characters | 5-7 | Preserve detail |
| Organic | 3-5 | Smooth surfaces |
| Mechanical | 7-10 | Hard edges |

## Browser Compatibility

- **Chrome**: Full support (JS & WASM)
- **Firefox**: Full support (JS & WASM)
- **Safari**: Full support (JS & WASM)
- **Edge**: Full support (JS & WASM)
- **Mobile**: WASM support varies; falls back to JS

The system automatically detects WASM support and falls back to JavaScript decoder when needed.

## Troubleshooting

### "Draco decoder not found"

Ensure decoder files are in `/public/draco/`:
- `draco_decoder.js`
- `draco_decoder.wasm`  
- `draco_wasm_wrapper.js`

### Slow Decoding

- Use WASM decoder (default when available)
- Preload decoder: `preloadDracoDecoder()`
- Consider pre-decompressing for critical models

### CORS Issues

If hosting decoder files on a CDN:
```
Access-Control-Allow-Origin: *
```

## File Size Reference

Example compression results:

| Model | Original | Compressed | Reduction |
|-------|----------|------------|-----------|
| Simple mesh | 1.2 MB | 180 KB | 85% |
| Character | 5.4 MB | 890 KB | 84% |
| Scene | 12 MB | 2.1 MB | 83% |

## Links

- [Draco GitHub](https://github.com/google/draco)
- [Three.js Draco Loader](https://threejs.org/docs/#examples/en/loaders/DRACOLoader)
- [GLTF Compression Guide](https://www.khronos.org/blog/google-draco-mesh-compression)
