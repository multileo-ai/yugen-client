import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F8FD]">
      <h1 className="text-4xl font-bold mb-6 text-[#6D6AEF]">
        Welcome to Yugen
      </h1>
      <button
        className="bg-[#6D6AEF] text-white px-6 py-2 rounded-md text-lg hover:bg-[#5a58d6]"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
};

export default Landing;
