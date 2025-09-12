import React, { useEffect, useRef } from "react";
import { Pose } from "@mediapipe/pose";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

const PostureCorrection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw video frame
      canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

      // Draw pose keypoints + connections
      if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, Pose.POSE_CONNECTIONS, { color: "#00FF00", lineWidth: 2 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { color: "#FF0000", lineWidth: 1 });
      }

      canvasCtx.restore();
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        await pose.send({ image: videoRef.current });
      },
      width: 640,
      height: 480,
    });
    camera.start();
  }, []);

  return (
    <div>
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
};

export default PostureCorrection;



