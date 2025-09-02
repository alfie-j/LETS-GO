import React, { useRef, useEffect, RefObject } from 'react';
import { cn } from '@/lib/utils';

interface FaceScanCameraProps {
  videoRef: RefObject<HTMLVideoElement>;
  isCameraActive: boolean;
  className?: string;
}

const FaceScanCamera = ({ videoRef, isCameraActive, className }: FaceScanCameraProps) => {
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const drawGrid = () => {
      const video = videoRef.current;
      const gridCanvas = gridCanvasRef.current;

      if (video && gridCanvas && isCameraActive && video.readyState >= 2) { // video.readyState >= 2 means current playback position is available
        const context = gridCanvas.getContext('2d');
        if (context) {
          // Ensure canvas dimensions match video dimensions
          gridCanvas.width = video.videoWidth;
          gridCanvas.height = video.videoHeight;

          // Clear canvas for redrawing
          context.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

          // Draw the grid
          context.strokeStyle = 'rgba(255, 255, 255, 0.3)'; // White, semi-transparent
          context.lineWidth = 1;

          const gridSize = 50; // Size of each grid cell

          // Draw vertical lines
          for (let x = 0; x < gridCanvas.width; x += gridSize) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, gridCanvas.height);
            context.stroke();
          }

          // Draw horizontal lines
          for (let y = 0; y < gridCanvas.height; y += gridSize) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(gridCanvas.width, y);
            context.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(drawGrid);
    };

    if (isCameraActive) {
      animationFrameId = requestAnimationFrame(drawGrid);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isCameraActive, videoRef]);

  return (
    <div className={cn("relative w-full aspect-video bg-muted rounded-xl overflow-hidden border-2 border-primary/30 shadow-inner", className)}>
      <video ref={videoRef} className="w-full h-full object-cover transform scale-x-[-1]" autoPlay playsInline muted />
      <canvas ref={gridCanvasRef} className="absolute inset-0 w-full h-full transform scale-x-[-1]" /> {/* Visible canvas for grid */}
    </div>
  );
};

export default FaceScanCamera;