import { Link } from "react-router";

export default function NotFound() {
  return (
    <>
      <title>404 Error</title>

      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div
          className="text-[13px] text-[#6B7268] mb-2 font-['Inter']"
        >
          Error 404
        </div>
        <div
          className="text-[64px] leading-none text-[#16211C] font-['Fraunces'] mb-4"
          style={{ fontWeight: 500 }}
        >
          Page not found
        </div>
        <p className="text-[14px] text-[#6B7268] font-['Inter'] max-w-xs mb-8">
          The page you're looking for doesn't exist, or may have moved.
        </p>
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-full bg-[#16211C] hover:bg-[#22322A] text-[#F6F7F1] text-sm font-medium font-['Inter'] transition-colors active:scale-95"
        >
          Back to dashboard
        </Link>
      </div>
    </>
  );
}