import React, { useRef, useState, useEffect } from 'react';

const VideoCall: React.FC = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [, setRemoteStream] = useState<MediaStream | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(
        null
    );

    useEffect(() => {
        // Функция для начала видео звонка
        const startCall = async () => {
            try {
                // Получение локального потока медиа
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }

                // Инициализация RTCPeerConnection
                const pc = new RTCPeerConnection();

                stream.getTracks().forEach(track => {
                    pc.addTrack(track)
                })

                pc.ontrack = (event) => {
                    setRemoteStream(event.streams[0]);
                    if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                setPeerConnection(pc);
            } catch (error) {
                console.error('Ошибка при запуске видео звонка:', error);
            }
        };

        startCall();

        return () => {
            // Остановка потоков при размонтировании компонента
            if (localStream) {
                localStream.getTracks().forEach((track) => track.stop());
            }
            if (peerConnection) {
                peerConnection.close();
            }
        };
    }, []);

    return (
        <div>
            <div>
                <video ref={localVideoRef} autoPlay playsInline muted style={{ width: 200, height: 150 }} />
            </div>
            <div>
                <video ref={remoteVideoRef} autoPlay playsInline style={{ width: 200, height: 150 }} />
            </div>
        </div>
    );
};

export default VideoCall;
