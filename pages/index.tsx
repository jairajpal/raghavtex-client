import PrivateRoute from "@/components/common/PrivateRoute";
import NavBar from "@/components/common/NavBar";
import RawMaterial from "@/components/common/RawMaterial";
import { useState } from "react";
import DispatchProduct from "@/components/common/DispatchProduct";
import MainPage from "@/components/common/MainPage";

export default function Home() {
  const [activeContent, setActiveContent] = useState("raw");
  const handleContentChange = (content: any) => {
    setActiveContent(content);
  };
  return (
    <PrivateRoute>
      <div>
        <NavBar
          onContentChange={handleContentChange}
          activeContent={activeContent}
        />
        {/* Content */}
        {activeContent === "home" && <MainPage />}
        {activeContent === "raw" && <RawMaterial />}
        {activeContent === "dispatch" && <DispatchProduct />}
        {/* {activeContent === 'contact' && <ContactContent />} */}
      </div>
    </PrivateRoute>
  );
}
