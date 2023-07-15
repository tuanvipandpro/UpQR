// Phải gọi DOMContentLoader để đảm bảo render xong mới gắn event
document.addEventListener('DOMContentLoaded', () => {
    const { ipcRenderer } = require('electron');
    const QRCode = require('qrcode');

    let qrDataURL = null;
    let qrDriveURL = null;

    const inputField = document.getElementById('url-input');
    const btnGen = document.getElementById('btn-gen');
    const qrCodeContainer = document.getElementById('qrCodeContainer');
    const downloadButton = document.getElementById('downloadButton');

    const selectFilesButton = document.getElementById('selectFilesButton');
    const qrCodeDriveURL = document.getElementById('qrCodeDriveURL');
    const downloadButtonFile = document.getElementById('downloadButtonFile');

    selectFilesButton.addEventListener('click', async () => {
        const url = await ipcRenderer.invoke('openFileSelectionDialog');
        if (url) {
            if (!url) {
                qrCodeContainer.style.display = 'none'
                downloadButtonFile.style.display = 'none'
                qrDataURL = null;
                return
            }
    
            downloadButtonFile.style.display = 'block'
            qrCodeDriveURL.style.display = 'block'
            QRCode.toCanvas(qrCodeDriveURL, url, { width: 256, height: 256 }, (error) => {
                if (error) {
                    qrDriveURL = null;
                    console.error('Error generating QR code:', error);
                }
            });
    
            qrDriveURL = qrCodeDriveURL.toDataURL();
        }
    });

    btnGen.addEventListener('click', () => {
        const inputData = inputField.value;

        if (!inputData) {
            qrCodeContainer.style.display = 'none'
            downloadButton.style.display = 'none'
            qrDataURL = null;
            return
        }

        downloadButton.style.display = 'block'
        QRCode.toCanvas(qrCodeContainer, inputData, { width: 256, height: 256 }, (error) => {
            if (error) {
                qrDataURL = null;
                console.error('Error generating QR code:', error);
            }
        });

        qrDataURL = qrCodeContainer.toDataURL();
    })

    downloadButton.addEventListener('click', () => {
        if (qrDataURL) {
            const link = document.createElement('a');
            link.href = qrDataURL;
            link.download = 'qrcode.png';
            link.addEventListener('download', () => {
                console.log('Tải xuống thành công');
            });
            link.click();
        }
    });

    downloadButtonFile.addEventListener('click', () => {
        if (qrDriveURL) {
            const link = document.createElement('a');
            link.href = qrDriveURL;
            link.download = 'qrcode.png';
            link.click();
        }
    })
});