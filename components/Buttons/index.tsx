export default function Button() {
  const openNewTab = () => {
    window.open("https://colab-huddle.vercel.app/gpa-vzfj-kpz", "_blank");
  };

  return <button className="bg-indigo-500 px-4 rounded-full text-white shadow-xl" onClick={openNewTab}>Join Meeting</button>;
}
