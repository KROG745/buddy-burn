const Index = () => {
  console.log("Index rendering - simplified version");
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <h1 className="text-2xl font-bold">BuddyBurn</h1>
        <p>Welcome back!</p>
      </header>
      
      <main className="p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Your fitness app is ready!</p>
        </div>
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex justify-around">
          <a href="/" className="text-purple-600">Home</a>
          <a href="/schedule" className="text-gray-600">Schedule</a>
          <a href="/profile" className="text-gray-600">Profile</a>
        </div>
      </nav>
    </div>
  );
};

export default Index;
