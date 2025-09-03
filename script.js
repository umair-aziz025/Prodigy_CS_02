// Image Encryption Tool
class ImageEncryptionTool {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupCanvas();
        this.initializeUI();
        
        // State management
        this.currentImage = null;
        this.originalImageData = null;
        this.encryptedImageData = null;
        this.isProcessing = false;
        
        // Performance monitoring
        this.performanceMetrics = {
            processingTimes: [],
            averageTime: 0
        };
    }

    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.imageInput = document.getElementById('imageInput');
        
        // Control elements
        this.algorithmSelect = document.getElementById('algorithmSelect');
        this.operationRadios = document.querySelectorAll('input[name="operation"]');
        this.encryptionKey = document.getElementById('encryptionKey');
        this.generateKeyBtn = document.getElementById('generateKey');
        this.strengthSlider = document.getElementById('strengthSlider');
        this.strengthDisplay = document.querySelector('.strength-display');
        
        // Canvas elements
        this.originalCanvas = document.getElementById('originalCanvas');
        this.resultCanvas = document.getElementById('resultCanvas');
        this.originalCtx = this.originalCanvas.getContext('2d');
        this.resultCtx = this.resultCanvas.getContext('2d');
        
        // Preview section elements
        this.imagePreviewSection = document.getElementById('imagePreviewSection');
        this.resultPanel = document.getElementById('resultPanel');
        
        // Processing elements
        this.processBtn = document.getElementById('processBtn');
        this.processBtnText = document.getElementById('processBtnText');
        this.processingStatus = document.getElementById('processingStatus');
        this.progressFill = document.getElementById('progressFill');
        this.statusText = document.getElementById('statusText');
        
        // Info elements
        this.originalSize = document.getElementById('originalSize');
        this.originalFormat = document.getElementById('originalFormat');
        this.processingTime = document.getElementById('processingTime');
        this.usedAlgorithm = document.getElementById('usedAlgorithm');
        
        // Action buttons
        this.downloadBtn = document.getElementById('downloadBtn');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Toast and loading
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        // Algorithm cards
        this.algorithmCards = document.querySelectorAll('.algorithm-card');
    }

    bindEvents() {
        // Upload events - Fix double selection issue
        this.uploadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.imageInput.click();
        });
        
        this.uploadArea.addEventListener('click', (e) => {
            // Only trigger if not clicking on the button
            if (!e.target.closest('.upload-btn')) {
                this.imageInput.click();
            }
        });
        
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        
        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Control events
        this.algorithmSelect.addEventListener('change', () => this.handleAlgorithmChange());
        this.operationRadios.forEach(radio => {
            radio.addEventListener('change', () => this.handleOperationChange());
        });
        this.encryptionKey.addEventListener('input', () => this.validateKey());
        this.generateKeyBtn.addEventListener('click', () => this.generateRandomKey());
        this.strengthSlider.addEventListener('input', () => this.handleStrengthChange());
        
        // Processing events
        this.processBtn.addEventListener('click', () => this.processImage());
        
        // Action events
        this.downloadBtn.addEventListener('click', () => this.downloadImage());
        this.resetBtn.addEventListener('click', () => this.resetApplication());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    setupCanvas() {
        // Set canvas properties for better image rendering
        this.originalCtx.imageSmoothingEnabled = true;
        this.originalCtx.imageSmoothingQuality = 'high';
        this.resultCtx.imageSmoothingEnabled = true;
        this.resultCtx.imageSmoothingQuality = 'high';
    }

    initializeUI() {
        this.handleAlgorithmChange();
        this.handleOperationChange();
        this.handleStrengthChange();
        this.generateRandomKey();
    }

    // File Upload Handlers
    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadImage(file);
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                this.loadImage(file);
            } else {
                this.showToast('Please upload a valid image file', 'error');
            }
        }
    }

    loadImage(file) {
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showToast('Image too large. Please use an image smaller than 10MB', 'error');
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
        if (!validTypes.includes(file.type)) {
            this.showToast('Unsupported image format', 'error');
            return;
        }

        this.showLoading(true);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.currentImage = img;
                this.displayOriginalImage(img);
                this.updateImageInfo(file);
                this.showImagePreview();
                this.showLoading(false);
                this.showToast('Image loaded successfully!', 'success');
            };
            img.onerror = () => {
                this.showLoading(false);
                this.showToast('Failed to load image', 'error');
            };
            img.src = e.target.result;
        };
        reader.onerror = () => {
            this.showLoading(false);
            this.showToast('Failed to read file', 'error');
        };
        reader.readAsDataURL(file);
    }

    displayOriginalImage(img) {
        // Calculate canvas size while maintaining aspect ratio
        const maxSize = 400;
        let { width, height } = img;
        
        if (width > height) {
            if (width > maxSize) {
                height = (height * maxSize) / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width = (width * maxSize) / height;
                height = maxSize;
            }
        }
        
        this.originalCanvas.width = width;
        this.originalCanvas.height = height;
        this.resultCanvas.width = width;
        this.resultCanvas.height = height;
        
        // Clear and draw image
        this.originalCtx.clearRect(0, 0, width, height);
        this.originalCtx.drawImage(img, 0, 0, width, height);
        
        // Store original image data
        this.originalImageData = this.originalCtx.getImageData(0, 0, width, height);
    }

    updateImageInfo(file) {
        this.originalSize.textContent = this.formatFileSize(file.size);
        this.originalFormat.textContent = file.type.split('/')[1].toUpperCase();
    }

    showImagePreview() {
        this.imagePreviewSection.style.display = 'grid';
        this.imagePreviewSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Control Handlers
    handleAlgorithmChange() {
        const selectedAlgorithm = this.algorithmSelect.value;
        
        // Update algorithm cards
        this.algorithmCards.forEach(card => {
            card.classList.remove('active');
            if (card.dataset.algorithm === selectedAlgorithm) {
                card.classList.add('active');
            }
        });
        
        // Update process button text
        this.updateProcessButtonText();
    }

    handleOperationChange() {
        this.updateProcessButtonText();
    }

    handleStrengthChange() {
        const strength = parseInt(this.strengthSlider.value);
        const strengthLabels = ['Low', 'Medium', 'High', 'Very High', 'Maximum'];
        this.strengthDisplay.textContent = strengthLabels[strength - 1];
    }

    updateProcessButtonText() {
        const operation = document.querySelector('input[name="operation"]:checked').value;
        const algorithm = this.algorithmSelect.options[this.algorithmSelect.selectedIndex].text;
        
        this.processBtnText.textContent = `${operation.charAt(0).toUpperCase() + operation.slice(1)} Image`;
    }

    generateRandomKey() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
        let key = '';
        for (let i = 0; i < 16; i++) {
            key += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        this.encryptionKey.value = key;
        this.validateKey();
    }

    validateKey() {
        const key = this.encryptionKey.value;
        const isValid = key.length >= 4;
        
        this.encryptionKey.style.borderColor = isValid ? 'var(--success-color)' : 'var(--error-color)';
        
        return isValid;
    }

    // Image Processing
    async processImage() {
        if (!this.currentImage || !this.originalImageData) {
            this.showToast('Please upload an image first', 'error');
            return;
        }

        if (!this.validateKey()) {
            this.showToast('Please enter a valid encryption key (minimum 4 characters)', 'error');
            this.encryptionKey.classList.add('shake');
            setTimeout(() => this.encryptionKey.classList.remove('shake'), 500);
            return;
        }

        this.isProcessing = true;
        this.processBtn.disabled = true;
        this.updateProcessingStatus('Initializing...', 0);

        try {
            const startTime = performance.now();
            
            const operation = document.querySelector('input[name="operation"]:checked').value;
            const algorithm = this.algorithmSelect.value;
            const key = this.encryptionKey.value;
            const strength = parseInt(this.strengthSlider.value);

            // Create a copy of the original image data
            const imageData = new ImageData(
                new Uint8ClampedArray(this.originalImageData.data),
                this.originalImageData.width,
                this.originalImageData.height
            );

            // Process image based on algorithm and operation
            let processedImageData;
            if (operation === 'encrypt') {
                processedImageData = await this.encryptImage(imageData, algorithm, key, strength);
            } else {
                processedImageData = await this.decryptImage(imageData, algorithm, key, strength);
            }

            // Display result
            this.resultCtx.putImageData(processedImageData, 0, 0);
            this.encryptedImageData = processedImageData;

            const endTime = performance.now();
            const processingTimeMs = (endTime - startTime).toFixed(2);
            
            // Update UI
            this.processingTime.textContent = `${processingTimeMs}ms`;
            this.usedAlgorithm.textContent = this.algorithmSelect.options[this.algorithmSelect.selectedIndex].text;
            this.resultPanel.style.display = 'block';
            this.updateProcessingStatus('Processing complete!', 100);
            
            // Record performance
            this.recordPerformance(processingTimeMs);
            
            this.showToast(`Image ${operation}ed successfully!`, 'success');

        } catch (error) {
            console.error('Processing error:', error);
            this.showToast('An error occurred during processing', 'error');
            this.updateProcessingStatus('Processing failed', 0);
        } finally {
            this.isProcessing = false;
            this.processBtn.disabled = false;
            setTimeout(() => {
                this.updateProcessingStatus('Ready to process', 0);
            }, 2000);
        }
    }

    async encryptImage(imageData, algorithm, key, strength) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        switch (algorithm) {
            case 'xor':
                return this.xorEncryption(imageData, key, strength);
            case 'shuffle':
                return this.pixelShuffle(imageData, key, strength, true);
            case 'rgb-rotation':
                return this.rgbRotation(imageData, strength, true);
            case 'mathematical':
                return this.mathematicalEncryption(imageData, key, strength);
            case 'bit-manipulation':
                return this.bitManipulation(imageData, key, strength, true);
            default:
                throw new Error('Unknown algorithm');
        }
    }

    async decryptImage(imageData, algorithm, key, strength) {
        switch (algorithm) {
            case 'xor':
                return this.xorEncryption(imageData, key, strength); // XOR is symmetric
            case 'shuffle':
                return this.pixelShuffle(imageData, key, strength, false);
            case 'rgb-rotation':
                return this.rgbRotation(imageData, strength, false);
            case 'mathematical':
                return this.mathematicalDecryption(imageData, key, strength);
            case 'bit-manipulation':
                return this.bitManipulation(imageData, key, strength, false);
            default:
                throw new Error('Unknown algorithm');
        }
    }

    // Encryption Algorithms
    xorEncryption(imageData, key, strength) {
        const data = new Uint8ClampedArray(imageData.data);
        const keyBytes = this.stringToBytes(key);
        const strengthMultiplier = strength * 51; // 0-255 range

        for (let i = 0; i < data.length; i += 4) {
            if (i % 1000 === 0) {
                this.updateProcessingStatus('XOR encryption...', (i / data.length) * 100);
            }

            const keyIndex = (i / 4) % keyBytes.length;
            const keyByte = (keyBytes[keyIndex] * strengthMultiplier) % 256;

            data[i] ^= keyByte;     // Red
            data[i + 1] ^= keyByte; // Green
            data[i + 2] ^= keyByte; // Blue
            // Alpha channel (i + 3) is left unchanged
        }

        return new ImageData(data, imageData.width, imageData.height);
    }

    pixelShuffle(imageData, key, strength, encrypt) {
        const data = new Uint8ClampedArray(imageData.data);
        const width = imageData.width;
        const height = imageData.height;
        const totalPixels = width * height;

        // Generate shuffle sequence based on key
        const shuffleSequence = this.generateShuffleSequence(totalPixels, key, strength);

        if (encrypt) {
            // Forward shuffle
            const tempData = new Uint8ClampedArray(data);
            for (let i = 0; i < totalPixels; i++) {
                if (i % 1000 === 0) {
                    this.updateProcessingStatus('Shuffling pixels...', (i / totalPixels) * 100);
                }

                const sourceIndex = i * 4;
                const targetIndex = shuffleSequence[i] * 4;

                data[targetIndex] = tempData[sourceIndex];
                data[targetIndex + 1] = tempData[sourceIndex + 1];
                data[targetIndex + 2] = tempData[sourceIndex + 2];
                data[targetIndex + 3] = tempData[sourceIndex + 3];
            }
        } else {
            // Reverse shuffle
            const tempData = new Uint8ClampedArray(data);
            for (let i = 0; i < totalPixels; i++) {
                if (i % 1000 === 0) {
                    this.updateProcessingStatus('Unshuffling pixels...', (i / totalPixels) * 100);
                }

                const sourceIndex = shuffleSequence[i] * 4;
                const targetIndex = i * 4;

                data[targetIndex] = tempData[sourceIndex];
                data[targetIndex + 1] = tempData[sourceIndex + 1];
                data[targetIndex + 2] = tempData[sourceIndex + 2];
                data[targetIndex + 3] = tempData[sourceIndex + 3];
            }
        }

        return new ImageData(data, imageData.width, imageData.height);
    }

    rgbRotation(imageData, strength, encrypt) {
        const data = new Uint8ClampedArray(imageData.data);
        const rotations = strength; // Number of rotations

        for (let i = 0; i < data.length; i += 4) {
            if (i % 1000 === 0) {
                this.updateProcessingStatus('Rotating RGB channels...', (i / data.length) * 100);
            }

            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            // Apply rotations
            for (let j = 0; j < rotations; j++) {
                if (encrypt) {
                    [r, g, b] = [b, r, g]; // R->G, G->B, B->R
                } else {
                    [r, g, b] = [g, b, r]; // Reverse rotation
                }
            }

            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
        }

        return new ImageData(data, imageData.width, imageData.height);
    }

    mathematicalEncryption(imageData, key, strength) {
        const data = new Uint8ClampedArray(imageData.data);
        const keySum = this.stringToBytes(key).reduce((sum, byte) => sum + byte, 0);
        const multiplier = (keySum % 100) + 1;
        const addend = (keySum % 50) + 1;

        for (let i = 0; i < data.length; i += 4) {
            if (i % 1000 === 0) {
                this.updateProcessingStatus('Mathematical encryption...', (i / data.length) * 100);
            }

            for (let j = 0; j < 3; j++) { // RGB channels only
                let value = data[i + j];
                value = (value * multiplier + addend * strength) % 256;
                data[i + j] = value;
            }
        }

        return new ImageData(data, imageData.width, imageData.height);
    }

    mathematicalDecryption(imageData, key, strength) {
        const data = new Uint8ClampedArray(imageData.data);
        const keySum = this.stringToBytes(key).reduce((sum, byte) => sum + byte, 0);
        const multiplier = (keySum % 100) + 1;
        const addend = (keySum % 50) + 1;
        
        // Calculate modular multiplicative inverse
        const modInverse = this.modularInverse(multiplier, 256);

        for (let i = 0; i < data.length; i += 4) {
            if (i % 1000 === 0) {
                this.updateProcessingStatus('Mathematical decryption...', (i / data.length) * 100);
            }

            for (let j = 0; j < 3; j++) { // RGB channels only
                let value = data[i + j];
                value = (value - addend * strength + 256) % 256;
                value = (value * modInverse) % 256;
                data[i + j] = value;
            }
        }

        return new ImageData(data, imageData.width, imageData.height);
    }

    bitManipulation(imageData, key, strength, encrypt) {
        const data = new Uint8ClampedArray(imageData.data);
        const keyBytes = this.stringToBytes(key);
        const shifts = strength % 8; // Bit shift amount

        for (let i = 0; i < data.length; i += 4) {
            if (i % 1000 === 0) {
                this.updateProcessingStatus('Bit manipulation...', (i / data.length) * 100);
            }

            const keyIndex = (i / 4) % keyBytes.length;
            const keyByte = keyBytes[keyIndex];

            for (let j = 0; j < 3; j++) { // RGB channels only
                let value = data[i + j];
                
                if (encrypt) {
                    // Rotate bits left and XOR with key
                    value = this.rotateLeft(value, shifts) ^ keyByte;
                } else {
                    // XOR with key and rotate bits right
                    value = this.rotateRight(value ^ keyByte, shifts);
                }
                
                data[i + j] = value & 0xFF;
            }
        }

        return new ImageData(data, imageData.width, imageData.height);
    }

    // Utility Functions
    stringToBytes(str) {
        const bytes = [];
        for (let i = 0; i < str.length; i++) {
            bytes.push(str.charCodeAt(i));
        }
        return bytes;
    }

    generateShuffleSequence(length, key, strength) {
        // Seed random number generator with key
        let seed = this.stringToBytes(key).reduce((sum, byte) => sum + byte, 0) * strength;
        const sequence = Array.from({ length }, (_, i) => i);

        // Fisher-Yates shuffle with seeded random
        for (let i = length - 1; i > 0; i--) {
            seed = (seed * 9301 + 49297) % 233280; // Linear congruential generator
            const j = Math.floor((seed / 233280) * (i + 1));
            [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
        }

        return sequence;
    }

    modularInverse(a, m) {
        // Extended Euclidean Algorithm
        let [oldR, r] = [a, m];
        let [oldS, s] = [1, 0];

        while (r !== 0) {
            const quotient = Math.floor(oldR / r);
            [oldR, r] = [r, oldR - quotient * r];
            [oldS, s] = [s, oldS - quotient * s];
        }

        return oldS < 0 ? oldS + m : oldS;
    }

    rotateLeft(value, shifts) {
        return ((value << shifts) | (value >> (8 - shifts))) & 0xFF;
    }

    rotateRight(value, shifts) {
        return ((value >> shifts) | (value << (8 - shifts))) & 0xFF;
    }

    // UI Updates
    updateProcessingStatus(message, progress) {
        this.statusText.textContent = message;
        this.progressFill.style.width = `${progress}%`;
    }

    recordPerformance(time) {
        this.performanceMetrics.processingTimes.push(parseFloat(time));
        const times = this.performanceMetrics.processingTimes;
        this.performanceMetrics.averageTime = times.reduce((sum, t) => sum + t, 0) / times.length;
    }

    // File Operations
    downloadImage() {
        if (!this.encryptedImageData) {
            this.showToast('No processed image to download', 'error');
            return;
        }

        // Create a temporary canvas for download
        const downloadCanvas = document.createElement('canvas');
        downloadCanvas.width = this.encryptedImageData.width;
        downloadCanvas.height = this.encryptedImageData.height;
        const downloadCtx = downloadCanvas.getContext('2d');
        downloadCtx.putImageData(this.encryptedImageData, 0, 0);

        // Convert to blob and download
        downloadCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            
            const operation = document.querySelector('input[name="operation"]:checked').value;
            const algorithm = this.algorithmSelect.value;
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
            
            a.download = `${operation}-${algorithm}-${timestamp}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('Image downloaded successfully!', 'success');
        }, 'image/png');
    }

    resetApplication() {
        // Reset state
        this.currentImage = null;
        this.originalImageData = null;
        this.encryptedImageData = null;
        this.isProcessing = false;

        // Reset UI
        this.imagePreviewSection.style.display = 'none';
        this.resultPanel.style.display = 'none';
        this.imageInput.value = '';
        
        // Clear canvases
        this.originalCtx.clearRect(0, 0, this.originalCanvas.width, this.originalCanvas.height);
        this.resultCtx.clearRect(0, 0, this.resultCanvas.width, this.resultCanvas.height);
        
        // Reset form
        this.generateRandomKey();
        this.updateProcessingStatus('Ready to process', 0);
        
        this.showToast('Application reset successfully', 'info');
    }

    // Utility Functions
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showToast(message, type = 'success') {
        this.toastMessage.textContent = message;
        
        // Show the toast first
        this.toast.style.display = 'flex';
        
        // Update toast appearance based on type
        this.toast.className = 'toast';
        this.toast.classList.add('show');
        
        const colors = {
            success: 'var(--success-color)',
            error: 'var(--error-color)',
            warning: 'var(--warning-color)',
            info: 'var(--info-color)'
        };
        
        this.toast.style.background = colors[type] || colors.success;
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            this.toast.classList.remove('show');
            // Hide completely after animation
            setTimeout(() => {
                this.toast.style.display = 'none';
            }, 300);
        }, 3000);
    }

    showLoading(show) {
        if (show) {
            this.loadingOverlay.classList.add('show');
        } else {
            this.loadingOverlay.classList.remove('show');
        }
    }

    handleKeyboardShortcuts(event) {
        // Ctrl+O or Cmd+O to open file
        if ((event.ctrlKey || event.metaKey) && event.key === 'o') {
            event.preventDefault();
            this.imageInput.click();
        }
        
        // Ctrl+S or Cmd+S to download
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            this.downloadImage();
        }
        
        // Ctrl+R or Cmd+R to reset (override default refresh)
        if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
            event.preventDefault();
            this.resetApplication();
        }
        
        // Enter to process image
        if (event.key === 'Enter' && !this.isProcessing && this.currentImage) {
            this.processImage();
        }
    }

    // Performance Monitoring
    getPerformanceReport() {
        const metrics = this.performanceMetrics;
        return {
            totalOperations: metrics.processingTimes.length,
            averageTime: metrics.averageTime.toFixed(2),
            fastestTime: Math.min(...metrics.processingTimes).toFixed(2),
            slowestTime: Math.max(...metrics.processingTimes).toFixed(2)
        };
    }
}

// Advanced Features for Power Users
class AdvancedImageFeatures {
    static analyzeImage(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;
        
        let totalR = 0, totalG = 0, totalB = 0;
        let minR = 255, minG = 255, minB = 255;
        let maxR = 0, maxG = 0, maxB = 0;
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            totalR += r; totalG += g; totalB += b;
            minR = Math.min(minR, r); minG = Math.min(minG, g); minB = Math.min(minB, b);
            maxR = Math.max(maxR, r); maxG = Math.max(maxG, g); maxB = Math.max(maxB, b);
        }
        
        const pixelCount = (data.length / 4);
        
        return {
            dimensions: { width, height },
            pixelCount,
            averageRGB: {
                r: Math.round(totalR / pixelCount),
                g: Math.round(totalG / pixelCount),
                b: Math.round(totalB / pixelCount)
            },
            minRGB: { r: minR, g: minG, b: minB },
            maxRGB: { r: maxR, g: maxG, b: maxB }
        };
    }

    static compareImages(original, processed) {
        if (original.data.length !== processed.data.length) {
            return { error: 'Images have different dimensions' };
        }

        let differences = 0;
        let totalDifference = 0;

        for (let i = 0; i < original.data.length; i += 4) {
            const diffR = Math.abs(original.data[i] - processed.data[i]);
            const diffG = Math.abs(original.data[i + 1] - processed.data[i + 1]);
            const diffB = Math.abs(original.data[i + 2] - processed.data[i + 2]);
            
            const pixelDiff = (diffR + diffG + diffB) / 3;
            totalDifference += pixelDiff;
            
            if (pixelDiff > 0) differences++;
        }

        const pixelCount = original.data.length / 4;
        return {
            changedPixels: differences,
            totalPixels: pixelCount,
            changePercentage: ((differences / pixelCount) * 100).toFixed(2),
            averageDifference: (totalDifference / pixelCount).toFixed(2)
        };
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the main application
    window.imageEncryptionApp = new ImageEncryptionTool();
    
    // Add developer console messages
    console.log('%c🖼️ Image Encryption Tool Loaded Successfully! 🔐', 'color: #667eea; font-size: 16px; font-weight: bold;');
    console.log('%cTry these developer commands:', 'color: #4a5568; font-size: 12px;');
    console.log('%c- imageEncryptionApp.getPerformanceReport()', 'color: #718096; font-size: 11px;');
    console.log('%c- AdvancedImageFeatures.analyzeImage(imageData)', 'color: #718096; font-size: 11px;');
    console.log('%c- AdvancedImageFeatures.compareImages(original, processed)', 'color: #718096; font-size: 11px;');
    
    // Service Worker registration for PWA capabilities
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ImageEncryptionTool, AdvancedImageFeatures };
}
