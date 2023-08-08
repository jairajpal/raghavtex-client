import PrivateRoute from "@/components/common/PrivateRoute";
import NavBar from "@/components/common/NavBar";
import RawMaterial from "@/components/common/RawMaterial";
import { useState } from "react";
import MainPage from "@/components/common/MainPage";
import Company from "@/components/common/Company";

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
        {activeContent === "raw" && (
          <RawMaterial activeContent={activeContent} />
        )}
        {activeContent === "dispatch" && (
          <RawMaterial activeContent={activeContent} />
        )}
        {activeContent === "company" && <Company />}
        {/* {activeContent === 'contact' && <ContactContent />} */}
      </div>
    </PrivateRoute>
  );
}
