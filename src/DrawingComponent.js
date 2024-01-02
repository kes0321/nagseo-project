import React, { useRef, useEffect, useState } from 'react';
import './DrawingComponent.css';

const DrawingComponent = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');

    const resizeCanvas = () => {
      context.canvas.width = window.innerWidth;
      context.canvas.height = window.innerHeight;
    };

    const startDrawing = (e) => {
      setIsDrawing(true);
      context.beginPath();
      draw(e);
    };

    const draw = (e) => {
      if (!isDrawing) return;

      context.lineWidth = 5;
      context.lineCap = 'round';
      context.strokeStyle = '#ff0000';

      context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
      context.stroke();
      context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    };

    const stopDrawing = () => {
      setIsDrawing(false);
      const dataURL = canvas.toDataURL('image/jpeg', 0.9);
      const blob = dataURLtoBlob(dataURL);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'drawing.png';
      link.click();
    };

    resizeCanvas(); // 최초에 한 번 실행

    window.addEventListener('resize', resizeCanvas);
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    // canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
    //   canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, [isDrawing]);

  return (
    <canvas ref={canvasRef} className='Wall-canvas' />
  );
};

export default DrawingComponent;
