import React, { useState, useEffect } from 'react';
import { QrReader } from 'react-qr-reader';

function Scanner() {
  const [result, setResult] = useState('');
  const [hasCameraPermission, setHasCameraPermission] = useState(false);

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  useEffect(() => {
    // Check camera permission
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(() => {
        setHasCameraPermission(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <div className="flex-1 flex justify-center items-center p-5">
        <div className="bg-[#2D2F36] mt-20 w-full sm:w-[30rem] md:w-[32rem] rounded-3xl p-4 content-box shadow-lg">
          <div className="px-2 flex items-center text-white justify-between font-semibold text-xl">
            <span>Scan</span>
          </div>
          {hasCameraPermission && (
            <div>
              <QrReader
                delay={1000}
                onError={handleError}
                onScan={handleScan}
                style={{ width: '100%' }}
              />
            </div>
          )}
          {!hasCameraPermission && <p>Please grant camera permission to use the scanner.</p>}
          <p>address: {result}</p>
        </div>
      </div>
    </>
  );
}

export default Scanner;
