export const mockComplaints = [
  {
    _id: "66b9c1e4a8d12f9c3a901234",
    category: "Sadak Ki Samasya",
    status: "registered",
    location: { city: "Indore", ward: "Vijay Nagar" },
    createdAt: "2026-01-06T09:42:10.234Z",
    conversation: {
      questions: [
        {
          key: "q1",
          question: "Samasya kab shuru hui?",
          answer: "Pichhle 2 hafte se sadak tuti hui hai",
          confidence: 0.92
        },
        {
          key: "q2",
          question: "Kitni baar shikayat ki?",
          answer: "3 baar nagar nigam ko bataya",
          confidence: 0.88
        }
      ]
    }
  },
  {
    _id: "66b9c222f7b812bc90124567",
    category: "Bijli Ki Samasya",
    status: "in_progress",
    location: { city: "Bhopal", area: "MP Nagar" },
    createdAt: "2026-01-07T12:18:44.101Z",
    conversation: {
      questions: [
        {
          key: "q1",
          question: "Bijli kab se nahi aa rahi?",
          answer: "Kal raat se bijli band hai",
          confidence: 0.95
        }
      ]
    }
  }
];
