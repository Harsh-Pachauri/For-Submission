import React, { useState, useRef, useEffect } from 'react';
import { Upload, Trophy, Heart, Swords, Home, Download, Loader2, X, Star, Clock, Gauge } from 'lucide-react';
import axios from "axios";
interface RoastResponse {
  _id: string;
  name: string;
  age: number;
  gender: string;
  upvotes: number;
  roastText: string;
  roastScore: number;
  imageUrl: string;
  imageId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Shoe {
  id: string;
  name: string;
  age: string;
  gender: string;
  image: string;
  roast: string;
  smellScore: number;
  deathCountdown: string;
}

interface Comment {
  id: string;
  shoeId: string;
  author: string;
  text: string;
}
type ApiResponse = {
  certificate: string;
  roast: string;
  smellScore: number;
  deathCountdown: string;
};

const App = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'roast' | 'leaderboard' | 'soulmate' | 'battle'>('home');
  const [currentShoe, setCurrentShoe] = useState<Shoe | null>(null);
  const [allShoes, setAllShoes] = useState<Shoe[]>([
      
  ]);
  const [comments, setComments] = useState<Comment[]>([
    ]);
  const [showCleaningModal, setShowCleaningModal] = useState(false);
  const [cleaningProgress, setCleaningProgress] = useState(0);
  const [cleaningStage, setCleaningStage] = useState('');
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    image: ''
  });
  const [battleShoe1, setBattleShoe1] = useState<Shoe | null>(null);
  const [battleShoe2, setBattleShoe2] = useState<Shoe | null>(null);
  const [battleWinner, setBattleWinner] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);



  useEffect(() => {
  const fetchShoes = async () => {
    try {
      // ✅ Tell axios what type of data we expect
      const res = await axios.get<any[]>("https://wreckathon-backend.onrender.com/api/roasts");

      const mappedData: Shoe[] = res.data.map((item) => ({
        id: item._id || item.id,
        name: item.name,
        age: item.age,
        gender: item.gender,
        image: item.imageUrl, // 👈 use the correct backend field
        roast: item.roast,
        smellScore: item.roastScore, // mapping roastScore → smellScore
        upvotes: item.upvotes,
        deathCountdown: "", // frontend only
      }));

      setAllShoes(mappedData);
    } catch (err) {
      console.error("Error fetching shoes:", err);
    }
  };

  fetchShoes();
}, []); // ✅ empty array → runs only once when component mounts



  const roastMessages = [
    "💀 Your face looks like it was designed by a committee 🧑‍⚖️ that couldn’t agree on anything! 🤷",
    "🥶 Every selfie you take is basically a jump scare.",
    "💔 Even Face ID refuses to recognize you — said it was ‘too disturbing.’",
    "🔥 Bro, your forehead’s so big 🏔️ it’s got its own zip code! 🏠.",
    "💔 Your mom saw your face and said: ‘delivery failed 📦, return to sender ↩️’",
    "😵 Your face screams : ‘try again in the next life 💀🔁",
    "🤦 Your face looks like life hit ⌨️ Ctrl+Z on you... ❌ but forgot 🔄 to redo 💀",
    "👶 When you were born, the doctor didn’t say “it’s a boy/girl.” 🙅‍♂️🩺 He said 'Oh no.'",
    "🧴 This face needs Photoshop 🎨, not facewash 🚿",
    "😬 Warning: Applying Fair & Lovely may cause depression 😭 after seeing no results on you 🚫",
  ];

  const cleaningStages = [
    "Scanning for signs of life... 🔍",
    "Negotiating with the fungi... 🍄",
    "Applying industrial-strength Febreze... 🌪️",
    "Consulting the Priest... 🙏",
    "Summoning angels... 👼",
    "Attempting reverse exorcism... 😈",
    "Calling NASA for backup... 🚀",
    "Petitioning the UN for help... 🌍",
    "SYSTEM FAILURE: BEYOND SALVATION... 💀"
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        callback(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRoast = () => {
    return roastMessages[Math.floor(Math.random() * roastMessages.length)];
  };

  const generateSmellScore = () => {
    return Math.floor(Math.random() * 30) + 70; // 70-100 for maximum insult
  };

  const generateDeathCountdown = () => {
    const options = [
      "2 weeks before they legally become a weapon",
      "5 days until they achieve sentience",
      "72 hours before the EPA intervenes",
      "3 minutes before they spontaneously combust",
      "Already dead, just hasn't realized it yet",
      "Time has given up measuring their decay"
    ];
    return options[Math.floor(Math.random() * options.length)];
  };

const handleFormSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!fileInputRef.current?.files?.[0]) {
    alert("Please upload an image!");
    return;
  }

  try {

    // 1️⃣ First call the roast API
    const roastRes = await axios.post<{ roast: string }>(
      "https://hackathon-ai-api-87ti.onrender.com/roast",
      {
        name: uploadForm.name,
        age: Number(uploadForm.age),
        gender: uploadForm.gender,
      }
    );

    const roastText = roastRes.data.roast;
    console.log (roastText)
    const formData = new FormData();
    formData.append("image", fileInputRef.current.files[0]);
    formData.append("name", uploadForm.name);
    formData.append("gender", uploadForm.gender);
    formData.append("age", uploadForm.age);
    formData.append("upvotes", "10");       // can be dynamic if you like
    formData.append("roastScore",  generateSmellScore().toString());
    formData.append("roastText", roastText);    // can be dynamic if you like

    // ✅ tell axios what to expect
    const res = await axios.post<RoastResponse>(
      "https://wreckathon-backend.onrender.com/api/roasts",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const data = res.data;

    // Map backend response → your Shoe type
    const newShoe: Shoe = {
      id: data._id,
      name: data.name,
      age: data.age.toString(),   // since Shoe.age is string
      gender: data.gender,
      image: data.imageUrl,
      roast: data.roastText, // backend doesn’t send roast text yet
      smellScore: data.roastScore,
      deathCountdown: "",          // frontend-only
    };

    setCurrentShoe(newShoe);
    setAllShoes(prev => [newShoe, ...prev]);
    setCurrentPage("roast");
  } catch (err) {
    console.error("Error uploading roast:", err);
    alert("Upload failed!");
  }
};


  const startCleaning = () => {
    setShowCleaningModal(true);
    setCleaningProgress(0);
    setCleaningStage(cleaningStages[0]);
    
    const interval = setInterval(() => {
      setCleaningProgress(prev => {
        const next = prev + Math.random() * 15 + 5;
        const stageIndex = Math.floor(next / 11);
        
        if (stageIndex < cleaningStages.length) {
          setCleaningStage(cleaningStages[stageIndex]);
        }
        
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setCleaningStage("💥⚠️ SYSTEM ERROR 404: Filter Applying algorithm self-destructed 🤯🚨😭 Please send help 🛑🤖💻");

          }, 1000);
        }
        
        return Math.min(next, 100);
      });
    }, 800);
  };

  const downloadCertificate = () => {
    if (!currentShoe) return;
    
    // Create a fake download experience
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(
      `🏆 OFFICIAL CERTIFICATE OF FACE DISGUST 🏆\n\n` +
      `This certifies that ${currentShoe.name} have been officially recognized as\n` +
      `ABSOLUTELY DISGUSTING by the International Board of Face Disgrace.\n\n` +
      `Smell Score: ${currentShoe.smellScore}/100 (1000 feet apart level)\n` +
      `Status: BEYOND SALVATION\n` +
      `Recommendation: Immediate blur — this face is not safe for 4K 📸💀\n\n` +
      `Signed: Prof. Uglystein von DisasterFace 🤓💀\n` +
      `Chief Face Disgrace Officer 💀👟`
    );
    link.download = `${currentShoe.name}-disgust-certificate.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const findSoulmate = () => {
    if (allShoes.length < 2) return null;
    const otherShoes = allShoes.filter(shoe => shoe.id !== currentShoe?.id);
    return otherShoes[Math.floor(Math.random() * otherShoes.length)];
  };

  const addComment = (shoeId: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      shoeId,
      author: `Roaster${Math.floor(Math.random() * 999)}`,
      text
    };
    setComments(prev => [...prev, newComment]);
  };

  const battleShoes = () => {
  if (!battleShoe1 || !battleShoe2) return;

  // Winner ko random choose karna
  const winner = Math.random() < 0.5 ? battleShoe1.name : battleShoe2.name;
  setBattleWinner(winner);

  setTimeout(() => {
    setBattleWinner(null);
  }, 10000);
};


  useEffect(() => {
    // Add some floating flies animation
    const flies = document.querySelectorAll('.fly');
    flies.forEach((fly, index) => {
      setInterval(() => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        (fly as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
      }, 3000 + index * 1000);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-400 via-yellow-300 to-red-500 font-comic relative overflow-x-hidden">
      {/* Floating Flies */}
      <div className="fly fixed text-2xl animate-pulse z-10">🧟</div>
      <div className="fly fixed text-2xl animate-bounce z-10" style={{left: '20%'}}>🧟</div>
      <div className="fly fixed text-2xl animate-ping z-10" style={{left: '80%'}}>🧟</div>
      
      {/* Hazard Tape Header */}
      <div className="bg-yellow-400 border-t-8 border-b-8 border-black border-dashed py-2">
        <div className="text-center text-black font-bold text-xl animate-pulse">
          ⚠️ Caution: Self-esteem not refundable. ⚠️
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-red-600 border-b-4 border-yellow-400 p-4 shadow-2xl">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1
  className="text-4xl font-bold text-yellow-300 animate-pulse cursor-pointer"
  onClick={() => window.open("https://hack-wreck.vercel.app", "_blank")}
>
  👶UGLY FACE DETECTOR💀
</h1>

          <div className="flex space-x-4">
            {[
              { id: 'home', icon: Home, label: 'FACE THE TRUTH' },
              { id: 'leaderboard', icon: Trophy, label: 'HALL OF SHAME' },
              { id: 'soulmate', icon: Heart, label: 'SOUL MATCH' },
              { id: 'battle', icon: Swords, label: 'FACE OFF' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full border-4 border-yellow-400 font-bold transition-all duration-300 hover:scale-110 hover:rotate-2 ${
                  currentPage === id 
                    ? 'bg-yellow-400 text-red-600 animate-bounce' 
                    : 'bg-green-500 text-white hover:bg-green-400'
                }`}
              >
                <Icon size={20} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <div className="text-center">
            <div className="bg-red-600 border-8 border-yellow-400 rounded-3xl p-8 mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
              <h2 className="text-6xl font-bold text-yellow-300 mb-4 animate-pulse">
                🤢 SHOW GROSS FACE 🤢
              </h2>
              <p className="text-2xl text-white mb-2">
                ⚠️ WARNING: YOUR EGO MAY NOT SURVIVE THIS ⚠️
              </p>
              <p className="text-lg text-yellow-200">
                💀 Prepare for maximum roasting. No mercy. No survivors. 💀
              </p>
            </div>

            <div className="bg-green-500 border-8 border-red-600 rounded-3xl p-8 shadow-2xl">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-2xl font-bold text-white mb-2">
                      👤 VICTIM'S NAME
                    </label>
                    <input
                      type="text"
                      value={uploadForm.name}
                      onChange={(e) => setUploadForm(prev => ({...prev, name: e.target.value}))}
                      className="w-full p-3 text-xl border-4 border-yellow-400 rounded-xl bg-yellow-100 font-bold focus:border-red-600 focus:outline-none"
                      placeholder="Enter your doomed name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-2xl font-bold text-white mb-2">
                      🎂 AGE OF SHAME
                    </label>
                    <input
                      type="number"
                      value={uploadForm.age}
                      onChange={(e) => setUploadForm(prev => ({...prev, age: e.target.value}))}
                      className="w-full p-3 text-xl border-4 border-yellow-400 rounded-xl bg-yellow-100 font-bold focus:border-red-600 focus:outline-none"
                      placeholder="How long you've been failing"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-2xl font-bold text-white mb-2">
                      ⚧️ GENDER OF DISGUST
                    </label>
                    <select
                      value={uploadForm.gender}
                      onChange={(e) => setUploadForm(prev => ({...prev, gender: e.target.value}))}
                      className="w-full p-3 text-xl border-4 border-yellow-400 rounded-xl bg-yellow-100 font-bold focus:border-red-600 focus:outline-none"
                    >
                      <option value="Male">Male Disaster</option>
                      <option value="Female">Female Catastrophe</option>
                      <option value="Other">Other Tragedy</option>
                    </select>
                  </div>
                </div>

                <div className="border-8 border-dashed border-yellow-400 rounded-3xl p-8 bg-red-700">
                  <div className="text-center">
                    <Upload size={64} className="mx-auto text-yellow-400 mb-4 animate-bounce" />
                    <h3 className="text-3xl font-bold text-yellow-400 mb-4">
                      📸 UPLOAD YOUR TRAGIC FACE 📸
                    </h3>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => setUploadForm(prev => ({...prev, image: url})))}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-yellow-400 text-red-600 px-8 py-4 text-2xl font-bold rounded-full border-4 border-red-600 hover:bg-yellow-300 hover:scale-110 transition-all duration-300 animate-pulse"
                    >
                      💀 CHOOSE DISASTER IMAGE 💀
                    </button>
                    {uploadForm.image && (
                      <div className="mt-6">
                        <img src={uploadForm.image} alt="Preview" className="max-w-xs mx-auto rounded-xl border-4 border-yellow-400" />
                        <p className="text-yellow-400 font-bold mt-2">🤢 OH NO! THEY'RE ALREADY LOOKING GROSS! 🤢</p>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!uploadForm.name || !uploadForm.age || !uploadForm.image}
                  className="w-full bg-yellow-400 text-red-600 px-8 py-6 text-4xl font-bold rounded-full border-8 border-red-600 hover:bg-yellow-300 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse shadow-2xl"
                >
                  🔥 GET ABSOLUTELY ROASTED 🔥
                </button>
              </form>
            </div>

            <div className="mt-8 bg-yellow-400 border-4 border-red-600 rounded-xl p-4">
              <p className="text-red-600 font-bold text-sm">
                📜 LEGAL DISCLAIMER: This site is not responsible for hurt feelings, broken mirrors, or existential crises about your face. 💀
              </p>
            </div>
          </div>
        )}

        {/* ROAST RESULT PAGE */}
        {currentPage === 'roast' && currentShoe && (
          <div className="space-y-8">
            <div className="text-center bg-red-600 border-8 border-yellow-400 rounded-3xl p-6">
              <h2 className="text-5xl font-bold text-yellow-400 animate-pulse">
                🔥 ROAST RESULTS ARE IN! 🔥
              </h2>
              <p className="text-2xl text-white mt-2">💀 Brace yourself for maximum damage 💀</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Shoe Image */}
              <div className="bg-green-500 border-8 border-red-600 rounded-3xl p-6">
                <h3 className="text-3xl font-bold text-white text-center mb-4">
                  👟 THE ACCUSED FACE 👟
                </h3>
                <div className="relative">
                  <img 
                    src={currentShoe.image} 
                    alt={currentShoe.name}
                    className="w-full rounded-xl border-4 border-yellow-400 shadow-2xl hover:animate-pulse"
                  />
                  <div className="absolute -top-2 -right-2 bg-red-600 text-yellow-400 px-4 py-2 rounded-full font-bold border-4 border-yellow-400 animate-bounce">
                    💀 GUILTY! 💀
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-center text-yellow-400 mt-4">
                  {currentShoe.name}
                </h4>
              </div>

              {/* Roast Text */}
              <div className="bg-yellow-400 border-8 border-red-600 rounded-3xl p-6">
                <h3 className="text-3xl font-bold text-red-600 text-center mb-4">
                  🎯 OFFICIAL ROAST VERDICT 🎯
                </h3>
                <div className="bg-red-600 text-yellow-400 p-6 rounded-xl border-4 border-yellow-400 text-center">
                  <p className="text-2xl font-bold leading-relaxed">
                    {currentShoe.roast}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Smell-O-Meter */}
              <div className="bg-red-600 border-8 border-yellow-400 rounded-3xl p-6">
                <div className="text-center">
                  <Gauge size={48} className="mx-auto text-yellow-400 mb-4 animate-spin" />
                  <h4 className="text-2xl font-bold text-yellow-400 mb-4">
                    🤢 SMELL-O-METER 🤢
                  </h4>
                  <div className="w-full bg-green-300 rounded-full h-8 border-4 border-yellow-400 mb-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-red-800 h-full rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                      style={{width: `${currentShoe.smellScore}%`}}
                    >
                      <span className="text-white font-bold text-sm">💀</span>
                    </div>
                  </div>
                  <p className="text-yellow-400 font-bold">
                    {currentShoe.smellScore}/100- Self Esteem Damage Index 📉!
                  </p>
                </div>
              </div>

              {/* Death Countdown */}
              <div className="bg-green-500 border-8 border-red-600 rounded-3xl p-6">
                <div className="text-center">
                  <Clock size={48} className="mx-auto text-white mb-4 animate-pulse" />
                  <h4 className="text-2xl font-bold text-white mb-4">
                    ⏰ NEXT PLASTIC SURGERY ESTIMATE 🏥🔪
                  </h4>
                  <div className="bg-red-600 text-yellow-400 p-4 rounded-xl border-4 border-yellow-400">
                    <p className="text-lg font-bold">
                      {currentShoe.deathCountdown}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificate */}
              <div className="bg-yellow-400 border-8 border-red-600 rounded-3xl p-6">
                <div className="text-center">
                  <Star size={48} className="mx-auto text-red-600 mb-4 animate-spin" />
                  <h4 className="text-2xl font-bold text-red-600 mb-4">
                    🏆 CERTIFICATE OF DISGUST 🏆
                  </h4>
                  <button
                    onClick={downloadCertificate}
                    className="bg-red-600 text-yellow-400 px-6 py-3 rounded-full font-bold border-4 border-yellow-400 hover:bg-red-500 hover:scale-110 transition-all duration-300"
                  >
                    <Download size={20} className="inline mr-2" />
                    DOWNLOAD SHAME
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6">
              <button
                onClick={startCleaning}
                className="bg-green-500 text-white px-8 py-4 text-2xl font-bold rounded-full border-4 border-yellow-400 hover:bg-green-400 hover:scale-110 transition-all duration-300 animate-bounce"
              >
                🧽 TRY TO APPLY FILTER 🧽
              </button>
              <button
                onClick={() => setCurrentPage('soulmate')}
                className="bg-pink-500 text-white px-8 py-4 text-2xl font-bold rounded-full border-4 border-yellow-400 hover:bg-pink-400 hover:scale-110 transition-all duration-300 animate-pulse"
              >
                💕 FIND MY SOUL MATCH 💕
              </button>
            </div>
          </div>
        )}

        {/* LEADERBOARD PAGE */}
        {currentPage === 'leaderboard' && (
          <div className="space-y-8">
            <div className="text-center bg-yellow-400 border-8 border-red-600 rounded-3xl p-6">
              <h2 className="text-5xl font-bold text-red-600 animate-pulse">
                🏆 HALL OF SHAME LEADERBOARD 🏆
              </h2>
              <p className="text-2xl text-red-600 mt-2">💀 The Most Disgusting Faces Ever Seen 💀</p>
            </div>

            <div className="space-y-6">
              {allShoes
                .sort((a, b) => b.smellScore - a.smellScore)
                .map((shoe, index) => (
                <div key={shoe.id} className="bg-red-600 border-8 border-yellow-400 rounded-3xl p-6 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center space-x-6">
                    {/* Rank */}
                    <div className={`text-6xl font-bold ${index === 0 ? 'text-yellow-300' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-white'} animate-pulse`}>
                      #{index + 1}
                    </div>

                    {/* Shoe Image */}
                    <img 
                      src={shoe.image} 
                      alt={shoe.name}
                      className="w-32 h-32 object-cover rounded-xl border-4 border-yellow-400"
                    />

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-yellow-400 mb-2">{shoe.name}</h3>
                      <p className="text-white text-lg mb-2">{(shoe.roast ?? "").slice(0, 100)}...</p>
                      <div className="flex items-center space-x-4">
                        <span className="bg-yellow-400 text-red-600 px-4 py-2 rounded-full font-bold">
                          💀 STINK: {shoe.smellScore}/100
                        </span>
                        <span className="text-yellow-400 font-bold">
                          ⏰ {shoe.deathCountdown}
                        </span>
                      </div>
                    </div>

                    {/* Trophy for winner */}
                    {index === 0 && (
                      <Trophy size={64} className="text-yellow-300 animate-bounce" />
                    )}
                  </div>

                  {/* Comments Section */}
                  <div className="mt-6 bg-yellow-400 rounded-xl p-4 border-4 border-red-600">
                    <h4 className="text-xl font-bold text-red-600 mb-4">💬 MORE ROASTING:</h4>
                    <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                      {comments
                        .filter(comment => comment.shoeId === shoe.id)
                        .map(comment => (
                          <div key={comment.id} className="bg-red-600 text-yellow-400 p-2 rounded-lg">
                            <span className="font-bold">{comment.author}:</span> {comment.text}
                          </div>
                        ))}
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOULMATE FINDER PAGE */}
        {currentPage === 'soulmate' && (
          <div className="space-y-8">
            <div className="text-center bg-pink-500 border-8 border-yellow-400 rounded-3xl p-6">
              <h2 className="text-5xl font-bold text-yellow-400 animate-pulse">
                💕 YOUR ZOMBIE TWIN MATCHER 💕
              </h2>
              <p className="text-2xl text-white mt-2">🤢 Two Souls, One Regret 🤢</p>
            </div>

            {currentShoe ? (
              <div className="bg-red-600 border-8 border-yellow-400 rounded-3xl p-8">
                <h3 className="text-3xl font-bold text-yellow-400 text-center mb-6">
                  🎯 FINDING YOUR PERFECT STINK MATCH 🎯
                </h3>
                
                {(() => {
                  const soulmate = findSoulmate();
                  if (!soulmate) return (
                    <p className="text-center text-white text-xl">
                      💔 No other face is tragic enough to match yours! You’re suffering in a league of your own 💔
                    </p>
                  );

                  const compatibility = Math.floor(Math.random() * 30) + 70; // 70-100% compatibility

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                      {/* Your shoe */}
                      <div className="text-center">
                        <h4 className="text-2xl font-bold text-yellow-400 mb-4">👟 YOUR DISASTER</h4>
                        <img 
                          src={currentShoe.image} 
                          alt={currentShoe.name}
                          className="w-full max-w-64 mx-auto rounded-xl border-4 border-yellow-400"
                        />
                        <p className="text-white font-bold mt-2">{currentShoe.name}</p>
                        <p className="text-yellow-400">Stink: {currentShoe.smellScore}/100</p>
                      </div>

                      {/* Match indicator */}
                      <div className="text-center">
                        <div className="bg-yellow-400 text-red-600 p-6 rounded-full border-8 border-red-600 animate-pulse">
                          <Heart size={64} className="mx-auto mb-4 animate-bounce" />
                          <div className="text-4xl font-bold">{compatibility}%</div>
                          <div className="text-xl font-bold">STINK MATCH!</div>
                        </div>
                        <p className="text-yellow-400 font-bold mt-4 text-xl">
                          💕 IT'S A JUMPSCARE ROMANCE! 💕
                        </p>
                      </div>

                      {/* Soulmate shoe */}
                      <div className="text-center">
                        <h4 className="text-2xl font-bold text-yellow-400 mb-4">👟 YOUR SOULMATE</h4>
                        <img 
                          src={soulmate.image} 
                          alt={soulmate.name}
                          className="w-full max-w-64 mx-auto rounded-xl border-4 border-yellow-400"
                        />
                        <p className="text-white font-bold mt-2">{soulmate.name}</p>
                        <p className="text-yellow-400">Stink: {soulmate.smellScore}/100</p>
                      </div>
                    </div>
                  );
                })()}

                <div className="mt-8 bg-yellow-400 text-red-600 p-6 rounded-xl border-4 border-red-600 text-center">
                  <h4 className="text-2xl font-bold mb-4">💌 ROMANTIC COMPATIBILITY REPORT 💌</h4>
                  <p className="text-lg font-bold">
                    🌹 “When two cursed faces meet, the universe glitches. Together, you could crash mirrors, shut down cameras, and make Photoshop cry. A true nightmare couple!” 🌹
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center bg-red-600 border-8 border-yellow-400 rounded-3xl p-8">
                <h3 className="text-3xl font-bold text-yellow-400 mb-4">
                  💔 NO FACE TO MATCH! 💔
                </h3>
                <p className="text-white text-xl mb-6">
                  You need to upload a rotten face first before finding your soulmate!
                </p>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="bg-yellow-400 text-red-600 px-8 py-4 text-xl font-bold rounded-full border-4 border-red-600 hover:bg-yellow-300 hover:scale-110 transition-all duration-300"
                >
                  🤢 UPLOAD HIDEOUS FACES 🤢
                </button>
              </div>
            )}
          </div>
        )}

        {/* BATTLE ARENA PAGE */}
        {currentPage === 'battle' && (
          <div className="space-y-8">
            <div className="text-center bg-red-600 border-8 border-yellow-400 rounded-3xl p-6">
              <h2 className="text-5xl font-bold text-yellow-400 animate-pulse">
                ⚔️ FACE OFF ARENA ⚔️
              </h2>
              <p className="text-2xl text-white mt-2">💀 Only the most disgusting profile survives! 💀</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Battle Station 1 */}
              <div className="bg-blue-500 border-8 border-yellow-400 rounded-3xl p-6">
                <h3 className="text-3xl font-bold text-yellow-400 text-center mb-4">
                   FIGHTER 1 ⚔️
                </h3>
                {battleShoe1 ? (
                  <div className="text-center">
                    <img 
                      src={battleShoe1.image} 
                      alt={battleShoe1.name}
                      className="w-full max-w-64 mx-auto rounded-xl border-4 border-yellow-400 mb-4"
                    />
                    <h4 className="text-2xl font-bold text-white mb-2">{battleShoe1.name}</h4>
                    <p className="text-yellow-400 font-bold">Stink Power: {battleShoe1.smellScore}/100</p>
                    <button
                      onClick={() => setBattleShoe1(null)}
                      className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-500"
                    >
                      ❌ REMOVE
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="border-4 border-dashed border-yellow-400 rounded-xl p-8 mb-4">
                      <Upload size={64} className="mx-auto text-yellow-400 mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => {
                          const newShoe: Shoe = {
                            id: Date.now().toString() + '1',
                            name: `Battle Face 1`,
                            age: '25',
                            gender: 'Unknown',
                            image: url,
                            roast: generateRoast(),
                            smellScore: generateSmellScore(),
                            deathCountdown: generateDeathCountdown()
                          };
                          setBattleShoe1(newShoe);
                        })}
                        ref={fileInputRef2}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef2.current?.click()}
                        className="bg-yellow-400 text-blue-500 px-6 py-3 rounded-full font-bold border-4 border-blue-500 hover:bg-yellow-300"
                      >
                        ⚔️ CHOOSE WARRIOR
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Battle Station 2 */}
              <div className="bg-green-500 border-8 border-yellow-400 rounded-3xl p-6">
                <h3 className="text-3xl font-bold text-yellow-400 text-center mb-4">
                  FIGHTER 2 ⚔️
                </h3>
                {battleShoe2 ? (
                  <div className="text-center">
                    <img 
                      src={battleShoe2.image} 
                      alt={battleShoe2.name}
                      className="w-full max-w-64 mx-auto rounded-xl border-4 border-yellow-400 mb-4"
                    />
                    <h4 className="text-2xl font-bold text-white mb-2">{battleShoe2.name}</h4>
                    <p className="text-yellow-400 font-bold">Stink Power: {battleShoe2.smellScore}/100</p>
                    <button
                      onClick={() => setBattleShoe2(null)}
                      className="mt-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold hover:bg-red-500"
                    >
                      ❌ REMOVE
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="border-4 border-dashed border-yellow-400 rounded-xl p-8 mb-4">
                      <Upload size={64} className="mx-auto text-yellow-400 mb-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => {
                          const newShoe: Shoe = {
                            id: Date.now().toString() + '2',
                            name: `Battle Face 2`,
                            age: '25',
                            gender: 'Unknown',
                            image: url,
                            roast: generateRoast(),
                            smellScore: generateSmellScore(),
                            deathCountdown: generateDeathCountdown()
                          };
                          setBattleShoe2(newShoe);
                        })}
                        ref={fileInputRef3}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef3.current?.click()}
                        className="bg-yellow-400 text-green-500 px-6 py-3 rounded-full font-bold border-4 border-green-500 hover:bg-yellow-300"
                      >
                        ⚔️ CHOOSE WARRIOR
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Battle Button */}
            {battleShoe1 && battleShoe2 && (
              <div className="text-center">
                <button
                  onClick={battleShoes}
                  className="bg-red-600 text-yellow-400 px-12 py-6 text-4xl font-bold rounded-full border-8 border-yellow-400 hover:bg-red-500 hover:scale-110 transition-all duration-300 animate-pulse"
                >
                  ⚔️💀 BATTLE FOR STINK SUPREMACY! 💀⚔️
                </button>
              </div>
            )}

            {/* Battle Result */}
            {battleWinner && (
              <div className="text-center bg-yellow-400 border-8 border-red-600 rounded-3xl p-8 animate-bounce">
                <h3 className="text-4xl font-bold text-red-600 mb-4">
                  🏆 VICTORY! 🏆
                </h3>
                <p className="text-2xl font-bold text-red-600">
                  💀 {battleWinner} WINS BY PURE DISGUST! 💀
                </p>
                <p className="text-lg text-red-600 mt-4">
                  🎉 The crowd goes wild! (Then immediately evacuates after seeing your face) 🎉
                </p>
                {/* Confetti effect */}
                <div className="text-6xl animate-bounce">🎊💀🎊</div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cleaning Modal */}
      {showCleaningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-red-600 border-8 border-yellow-400 rounded-3xl p-8 max-w-lg w-full mx-4">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-yellow-400 mb-6">
                🧽 EMERGENCY SHOE CLEANING PROTOCOL 🧽
              </h3>
              
              <div className="bg-yellow-400 rounded-full h-8 border-4 border-red-600 mb-4">
                <div 
                  className="bg-green-500 h-full rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                  style={{width: `${cleaningProgress}%`}}
                >
                  {cleaningProgress > 0 && (
                    <Loader2 size={20} className="text-white animate-spin" />
                  )}
                </div>
              </div>
              
              <p className="text-white text-xl font-bold mb-6">
                {cleaningStage}
              </p>
              
              <p className="text-yellow-400 text-lg">
                Progress: {Math.floor(cleaningProgress)}%
              </p>
              
              {cleaningProgress >= 100 && (
                <button
                  onClick={() => {
                    setShowCleaningModal(false);
                    setCleaningProgress(0);
                  }}
                  className="mt-6 bg-yellow-400 text-red-600 px-6 py-3 rounded-full font-bold border-4 border-red-600 hover:bg-yellow-300"
                >
                  <X size={20} className="inline mr-2" />
                  ACCEPT DEFEAT
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black border-t-8 border-yellow-400 p-6 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-yellow-400 text-lg font-bold mb-2">
            💀 UGLY FACE DETECTOR: One Selfie and your mirror files for retirement 💀
          </p>
          <p className="text-white text-sm">
            📜 Not responsible for hurt feelings 💔, u being mistaken for a zombie 🧟, or sudden urges to delete all selfies📵
          </p>
          <p className="text-yellow-400 text-xs mt-2">
            🪰 Flies included free of charge 🪰
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
