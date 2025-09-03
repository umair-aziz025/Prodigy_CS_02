# PixelVault - Image Encryption Tool

A modern, responsive web application for encrypting and decrypting images using pixel manipulation techniques.

## 🚀 Features

- **Image Upload**: Support for multiple image formats (JPEG, PNG, GIF, WebP)
- **Pixel Manipulation**: Advanced encryption using various mathematical operations
- **Multiple Algorithms**: Choose from different encryption methods
- **Real-time Preview**: See encryption/decryption results instantly
- **Download Results**: Save encrypted/decrypted images
- **Responsive Design**: Works perfectly on all devices
- **Drag & Drop**: Easy file upload interface
- **Security Options**: Multiple encryption strength levels

## 🛠️ Technologies Used

- **HTML5**: Canvas API for image manipulation
- **CSS3**: Modern styling with animations and responsive design
- **JavaScript (ES6+)**: Advanced image processing algorithms
- **File API**: Handle image uploads and downloads
- **Canvas API**: Direct pixel manipulation
- **Web Workers**: Background processing for large images

## 🎯 How It Works

The application uses various pixel manipulation techniques:

1. **XOR Encryption**: XOR each pixel with a key
2. **Pixel Swapping**: Rearrange pixel positions
3. **Color Channel Rotation**: Rotate RGB values
4. **Mathematical Operations**: Apply arithmetic to pixel values
5. **Bit Shifting**: Manipulate individual bits

## 🔧 Installation & Usage

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd image-encryption-tool
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - Or use a local server for development

3. **For development server** (optional):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

## 💡 Usage Instructions

1. **Upload Image**: Click "Choose Image" or drag & drop an image file
2. **Select Algorithm**: Choose your preferred encryption method
3. **Set Parameters**: Adjust encryption strength and options
4. **Encrypt/Decrypt**: Click the process button
5. **Download**: Save your processed image

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1200px+)
- Tablets (768px - 1199px)
- Mobile phones (320px - 767px)

## 🎨 Supported Formats

- **Input**: JPEG, PNG, GIF, WebP, BMP
- **Output**: PNG (lossless), JPEG (with quality options)

## 🔮 Encryption Algorithms

### 1. XOR Cipher
- Applies XOR operation with a secret key
- Reversible with the same key
- Fast processing speed

### 2. Pixel Shuffle
- Rearranges pixel positions using a seed
- Creates visual scrambling effect
- Maintains color distribution

### 3. RGB Rotation
- Rotates color channels (R→G→B→R)
- Simple but effective visual encryption
- Preserves image structure

### 4. Mathematical Encryption
- Applies arithmetic operations to pixel values
- Customizable parameters
- Strong encryption potential

### 5. Bit Manipulation
- Works at the bit level
- High security encryption
- Slower but more secure

## 🔒 Security Features

- **Client-side Processing**: All encryption happens locally
- **No Data Upload**: Images never leave your device
- **Multiple Key Types**: Numeric, text, and file-based keys
- **Encryption Strength**: Adjustable security levels

## 🚀 Performance Optimizations

- **Web Workers**: Background processing for large images
- **Canvas Optimization**: Efficient pixel manipulation
- **Memory Management**: Proper cleanup and garbage collection
- **Progressive Loading**: Handle large files smoothly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created with ❤️ by **Umair Aziz**

### Connect with me:
- 🔗 [LinkedIn](https://www.linkedin.com/in/umairaziz001/)
- 🐙 [GitHub](https://github.com/umair-aziz025/)
- 🌐 [Portfolio](https://umairaziz-cyber-portfolio.vercel.app/)

## 🙏 Acknowledgments

- HTML5 Canvas API
- Modern cryptographic principles
- Image processing techniques
- Web security best practices

## ⚠️ Disclaimer

This tool is for educational and demonstration purposes. For production-grade security, use established cryptographic libraries and protocols.
