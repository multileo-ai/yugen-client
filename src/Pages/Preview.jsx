import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const Preview = () => {
  const { taskId } = useParams();
  const iframeRef = useRef(null);

  useEffect(() => {
    console.log("Preview mounted for taskId:", taskId);

    const updateIframe = () => {
      const fullCode =
        sessionStorage.getItem(`livePreviewCode_${taskId}`) || "";
      console.log(
        "Loaded fullCode for",
        taskId,
        fullCode ? "FOUND" : "NOT FOUND"
      );
      const iframe = iframeRef.current;
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(fullCode);
        doc.close();
      }
    };

    updateIframe();
    const interval = setInterval(updateIframe, 500);
    return () => clearInterval(interval);
  }, [taskId]);

  return (
    <div className="w-full h-screen">
      <iframe
        ref={iframeRef}
        title={`Preview for Task ${taskId}`}
        className="w-full h-full border-none"
      />
    </div>
  );
};

export default Preview;
