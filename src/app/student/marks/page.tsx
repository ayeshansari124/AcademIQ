"use client";
import { useEffect, useState } from "react";
import UploadMarksModal from "@/components/modals/AddExamModal";
import MarksProgressChart from "@/components/charts/SubjectProgressChart";

export default function StudentMarksPage() {
  const [marks, setMarks] = useState<any[]>([]);

  function load() {
    fetch("/api/student/marks")
      .then(res => res.json())
      .then(setMarks);
  }

  useEffect(load, []);

  function upload(data: any) {
    fetch("/api/student/marks", {
      method: "POST",
      body: JSON.stringify(data),
    }).then(load);
  }

  return (
    <div>
      <h1>My Marks</h1>
      <UploadMarksModal onSubmit={upload} />
      <MarksProgressChart data={marks} />
    </div>
  );
}
