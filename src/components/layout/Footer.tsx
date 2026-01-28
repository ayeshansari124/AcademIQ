export default function Footer() {
  return (
    <footer className="mt-16 bg-blue-900">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-white">
            © {new Date().getFullYear()} AcademIQ. All rights reserved.
          </p>

          <p className="text-xs text-white">Built with 💙 by Ayesha</p>
        </div>
      </div>
    </footer>
  );
}
