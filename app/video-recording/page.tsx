"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import BackButton from "@/components/back-button";
import UserProfile from "@/components/user-profile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function VideoRecordingPage() {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [userName, setUserName] = useState<string>("User");
    const [userPicture, setUserPicture] = useState<string | undefined>(undefined);
    const [showInstructions, setShowInstructions] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [hasPermission, setHasPermission] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const playbackRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const MAX_RECORDING_TIME = 300; // 5 minutes in seconds

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Request webcam access
    const requestWebcamAccess = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: true,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setHasPermission(true);
            setError(null);
        } catch (err: any) {
            console.error("Webcam access error:", err);
            setError("Unable to access webcam. Please grant camera permissions.");
            setHasPermission(false);
        }
    };

    useEffect(() => {
        // Check if video already recorded
        const checkVideoStatus = async () => {
            try {
                const response = await api.get("/api/user/profile");
                if (response.data.success && response.data.user) {
                    const { videoRecorded, name, picture } = response.data.user;
                    if (name) setUserName(name);
                    if (picture) setUserPicture(picture);

                    // If video already recorded, redirect to success
                    if (videoRecorded) {
                        router.push("/success");
                        return;
                    }
                }
            } catch (err) {
                console.error("Error checking video status:", err);
            }
        };

        checkVideoStatus();
        requestWebcamAccess();

        return () => {
            // Cleanup
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [router]);

    // Set playback video source when recordedBlob changes
    useEffect(() => {
        if (recordedBlob && playbackRef.current) {
            const blobUrl = URL.createObjectURL(recordedBlob);
            console.log("Setting playback URL:", blobUrl);
            playbackRef.current.src = blobUrl;
            playbackRef.current.load();

            // Cleanup blob URL on unmount
            return () => {
                URL.revokeObjectURL(blobUrl);
            };
        }
    }, [recordedBlob]);

    // Start recording
    const startRecording = () => {
        if (!streamRef.current) {
            setError("No webcam stream available");
            return;
        }

        try {
            chunksRef.current = [];
            const mediaRecorder = new MediaRecorder(streamRef.current, {
                mimeType: "video/webm;codecs=vp9",
            });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                console.log("Blob created:", blob.size, "bytes");
                setRecordedBlob(blob);

                // Stop webcam stream after blob is created
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop());
                    streamRef.current = null;
                }
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
            };

            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
            setRecordingTime(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => {
                    const newTime = prev + 1;
                    if (newTime >= MAX_RECORDING_TIME) {
                        stopRecording();
                    }
                    return newTime;
                });
            }, 1000);
        } catch (err: any) {
            console.error("Recording error:", err);
            setError("Failed to start recording. Please try again.");
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }
    };

    // Reset recording
    const resetRecording = async () => {
        setRecordedBlob(null);
        setRecordingTime(0);
        setError(null);
        setUploadProgress(0);
        if (playbackRef.current) {
            playbackRef.current.src = "";
        }

        // Restart webcam stream
        await requestWebcamAccess();
    };

    // Upload to S3
    const uploadVideo = async () => {
        if (!recordedBlob) return;

        setIsUploading(true);
        setError(null);

        try {
            // Convert webm to mp4 format name (backend handles the actual format)
            const formData = new FormData();
            formData.append("video", recordedBlob, "video.mp4");

            // Simulate progress (since we can't track actual upload progress easily with axios)
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => Math.min(prev + 10, 90));
            }, 200);

            const response = await api.post("/api/user/video/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (response.data.success) {
                // Video uploaded successfully - redirect to success page
                setTimeout(() => {
                    router.push("/success");
                    router.refresh();
                }, 1000);
            }
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.response?.data?.error || "Failed to upload video. Please try again.");
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    };

    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const InstructionsContent = () => (
        <>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recording Instructions</h3>
            <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                    <span className="text-[#00D084] font-bold">1.</span>
                    <span>Position yourself in a well-lit area with minimal background noise</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-[#00D084] font-bold">2.</span>
                    <span>Introduce yourself briefly</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-[#00D084] font-bold">3.</span>
                    <span>Talk about a <strong>technical decision</strong>, a <strong>technical win</strong>, and a <strong>technical failure</strong> you had recently</span>
                </li>
                <li className="flex items-start gap-2">
                    <span className="text-[#00D084] font-bold">4.</span>
                    <span>Maximum recording time: 5 minutes</span>
                </li>
            </ul>
            <button
                onClick={() => setShowInstructions(false)}
                className="mt-6 w-full px-6 py-3 bg-[#00D084] text-white rounded-full font-semibold hover:bg-[#00B872] transition-all"
            >
                Got it, let's start
            </button>
        </>
    );

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <BackButton href="/onboarding" />
                    <div className="flex flex-col leading-none">
                        <span className="text-2xl font-bold tracking-tighter">Intake</span>
                        <span className="text-[10px] text-[#00D084] font-medium tracking-wide text-right -mt-1">by onboard</span>
                    </div>
                    <UserProfile name={userName} picture={userPicture} />
                </div>
            </nav>

            {/* Instructions Modal/Drawer */}
            {isMobile ? (
                <Drawer open={showInstructions} onOpenChange={setShowInstructions}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Video Recording</DrawerTitle>
                            <DrawerDescription>
                                Follow these instructions for your video submission
                            </DrawerDescription>
                        </DrawerHeader>
                        <InstructionsContent />
                    </DrawerContent>
                </Drawer>
            ) : (
                <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
                    <DialogContent>
                        <DialogHeader onClose={() => setShowInstructions(false)}>
                            <DialogTitle>Video Recording</DialogTitle>
                            <DialogDescription>
                                Follow these instructions for your video submission
                            </DialogDescription>
                        </DialogHeader>
                        <InstructionsContent />
                    </DialogContent>
                </Dialog>
            )}

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-2 md:px-6 pt-20 md:pt-24 pb-8 md:pb-12">
                <div className="max-w-6xl w-full">
                    {/* Header */}
                    <div className="text-center mb-6 md:mb-8">
                        <div className="inline-block mb-3 md:mb-4 px-3 py-1 md:px-4 md:py-2 bg-[#00D084]/10 rounded-full text-xs md:text-sm font-medium text-[#00D084]">
                            Step 3: Record Your Introduction
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
                            <span className="text-[#00D084]">Video</span> Introduction
                        </h1>
                        <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
                            Share your recent technical decisions, wins, and failures
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Video Container */}
                    <div className="bg-gray-50 rounded-2xl md:rounded-3xl p-3 md:p-8 border border-gray-200">
                        {/* Video Display */}
                        <div className="relative bg-black rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-6" style={{ aspectRatio: "16/9" }}>
                            {!recordedBlob ? (
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    ref={playbackRef}
                                    controls
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {/* Recording Indicator */}
                            {isRecording && (
                                <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full">
                                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                    <span className="font-semibold">REC</span>
                                </div>
                            )}

                            {/* Timer */}
                            {(isRecording || recordedBlob) && (
                                <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full font-mono text-lg">
                                    {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
                                </div>
                            )}

                            {/* No Permission Overlay */}
                            {!hasPermission && (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90">
                                    <div className="text-center text-white p-6">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <p className="text-lg font-semibold mb-2">Camera Access Required</p>
                                        <p className="text-gray-300 mb-4">Please allow camera access to continue</p>
                                        <button
                                            onClick={requestWebcamAccess}
                                            className="px-6 py-2 bg-[#00D084] text-white rounded-full hover:bg-[#00B872] transition-all"
                                        >
                                            Grant Access
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Upload Progress */}
                        {isUploading && (
                            <div className="mb-6">
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>Uploading video...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-[#00D084] h-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {!recordedBlob ? (
                                <>
                                    {!isRecording ? (
                                        <button
                                            onClick={startRecording}
                                            disabled={!hasPermission}
                                            className="px-8 py-4 bg-[#00D084] text-white rounded-full font-semibold hover:bg-[#00B872] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <circle cx="10" cy="10" r="8" />
                                            </svg>
                                            Start Recording
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopRecording}
                                            className="px-8 py-4 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-all hover:scale-105 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <rect x="6" y="6" width="8" height="8" />
                                            </svg>
                                            Stop Recording
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={resetRecording}
                                        disabled={isUploading}
                                        className="px-8 py-4 bg-gray-200 text-gray-900 rounded-full font-semibold hover:bg-gray-300 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        onClick={uploadVideo}
                                        disabled={isUploading}
                                        className="px-8 py-4 bg-[#00D084] text-white rounded-full font-semibold hover:bg-[#00B872] transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                    >
                                        {isUploading ? "Uploading..." : "Submit Video"}
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Help Text */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowInstructions(true)}
                                className="text-sm text-gray-600 hover:text-[#00D084] transition-colors underline"
                            >
                                View instructions again
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="py-8 px-6 bg-gray-900 text-white text-center">
                <p className="text-sm opacity-80">
                    Built for engineers who respect reality.
                </p>
            </div>
        </div>
    );
}
