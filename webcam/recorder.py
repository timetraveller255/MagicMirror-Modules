import cv2
import numpy as np
import datetime
import os
import sys

SAVE_DIR = os.path.expanduser("~/MagicMirror/modules/webcam/recordings")
os.makedirs(SAVE_DIR, exist_ok=True)

STREAM_URL = "http://192.168.68.101:8085/?action=stream"
cap = cv2.VideoCapture(STREAM_URL)

avg_frame = None
out = None
recording = False
frames_after_motion = 0
MAX_IDLE_FRAMES = 90  # ~3 secunde la 30 FPS

FRAME_WIDTH = 640
FRAME_HEIGHT = 360
FPS = 25.0
MIN_AREA = 4000

try:
    while True:
        ret, frame = cap.read()
        if not ret or frame is None:
            continue

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(gray, (31, 31), 0)

        if avg_frame is None:
            avg_frame = gray.astype("float")
            continue

        cv2.accumulateWeighted(gray, avg_frame, 0.05)
        frame_delta = cv2.absdiff(gray, cv2.convertScaleAbs(avg_frame))

        thresh = cv2.threshold(frame_delta, 25, 255, cv2.THRESH_BINARY)[1]
        thresh = cv2.dilate(thresh, None, iterations=2)

        contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        motion_detected = any(cv2.contourArea(c) > MIN_AREA for c in contours)

        if motion_detected:
            frames_after_motion = MAX_IDLE_FRAMES
            if not recording:
                recording = True
                timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = os.path.join(SAVE_DIR, f"motion_{timestamp}.mp4")
                fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                
                out = cv2.VideoWriter(filename, fourcc, FPS, (FRAME_WIDTH, FRAME_HEIGHT))
                print("MOTION_STARTED", flush=True)

        if recording:
            out.write(frame)
            if not motion_detected:
                frames_after_motion -= 1
                if frames_after_motion <= 0:
                    recording = False
                    out.release()
                    out = None
                    print("MOTION_STOPPED", flush=True)

except KeyboardInterrupt:
    pass
finally:
    if out:
        out.release()
    cap.release()