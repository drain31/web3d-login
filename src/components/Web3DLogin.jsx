import { useState, useEffect } from "react";

// Data pengguna untuk login
const users = {
  rahmadani: { password: "nisyaputri03", image: "/simulator.png", saldo: 875 },
};

export default function Web3DLogin() {
  const [username, setUsername] = useState(""); // Username input
  const [password, setPassword] = useState(""); // Password input
  const [loggedIn, setLoggedIn] = useState(false); // Status login
  const [image, setImage] = useState(""); // Gambar pengguna
  const [error, setError] = useState(""); // Pesan error
  const [saldo, setSaldo] = useState(0); // Saldo pengguna
  const [withdrawAmount, setWithdrawAmount] = useState(""); // Jumlah penarikan
  const [pending, setPending] = useState(false); // Status penarikan
  const [pendingMessage, setPendingMessage] = useState(""); // Pesan penarikan pending
  const [resumedMessage, setResumedMessage] = useState(""); // Pesan penarikan berhasil
  const [loading, setLoading] = useState(false); // Status loading
  const [otp, setOtp] = useState(""); // OTP untuk verifikasi
  const [transactionHistory, setTransactionHistory] = useState([]); // Riwayat transaksi
  const [bank, setBank] = useState(""); // Pilihan bank
  const [accountNumber, setAccountNumber] = useState(""); // Nomor rekening
  
  // Generate OTP untuk verifikasi
  const generateOtp = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  // Fungsi login
  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      if (users[username] && users[username].password === password) {
        setImage(users[username].image);
        setSaldo(users[username].saldo);
        setLoggedIn(true);
        setError("");
      } else {
        setError("Invalid username or password");
      }
      setLoading(false);
    }, 1000);
  };

  // Fungsi penarikan dana
  const handleWithdraw = () => {
    if (!bank || !accountNumber) {
      alert("Pilih bank dan masukkan nomor rekening.");
      return;
    }
    const currentDate = new Date();
    const resumedDate = new Date("2025-04-06");

    setLoading(true);
    setTimeout(() => {
      if (currentDate < resumedDate) {
        setPending(true);
        setPendingMessage("Penarikan sedang pending, transaksi akan cair mulai 6 April 2025.");
        setResumedMessage("");
      } else if (withdrawAmount && Number(withdrawAmount) <= saldo) {
        setSaldo(saldo - Number(withdrawAmount));
        setTransactionHistory([...transactionHistory, { amount: withdrawAmount, date: new Date().toLocaleString(), bank, accountNumber }]);
        setWithdrawAmount("");
        alert(`OTP: ${generateOtp()} (Masukkan kode ini untuk verifikasi)`);
        setResumedMessage("Penarikan Anda telah berhasil dan dana sudah dicairkan.");
      } else {
        alert("Saldo tidak mencukupi");
      }
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Tidak ada tampilan lain yang muncul sebelum login
    if (loggedIn) {
      // Anda bisa melakukan sesuatu setelah login di sini
    }
  }, [loggedIn]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans">
      <div className="container w-96 p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
        {!loggedIn ? (
          // Form Login
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="bg-gray-700 border-none w-full p-2 rounded" 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="bg-gray-700 border-none w-full p-2 rounded" 
              />
              <button 
                onClick={handleLogin} 
                className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded"
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </div>
          </>
        ) : (
          // Tampilan setelah login
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Welcome, {username}!</h2>
            <img src={image} alt="Simulator" className="w-full rounded-lg mb-4" />
            <p className="text-center text-lg font-medium">Saldo Anda:</p>
            <p className="text-center text-2xl font-bold mt-1">${saldo}</p>
            <div className="space-y-4 mt-4">
              <select 
                value={bank} 
                onChange={(e) => setBank(e.target.value)} 
                className="bg-gray-700 border-none w-full p-2 rounded"
              >
                <option value="">Pilih Bank</option>
                <option value="BCA">BCA</option>
                <option value="BNI">BNI</option>
                <option value="Mandiri">Mandiri</option>
                <option value="BRI">BRI</option>
              </select>
              <input 
                type="text" 
                placeholder="Nomor Rekening" 
                value={accountNumber} 
                onChange={(e) => setAccountNumber(e.target.value)} 
                className="bg-gray-700 border-none w-full p-2 rounded" 
              />
              <input 
                type="number" 
                placeholder="Jumlah Penarikan" 
                value={withdrawAmount || ""} 
                onChange={(e) => setWithdrawAmount(e.target.value)} 
                className="bg-gray-700 border-none w-full p-2 rounded" 
              />
              <button 
                onClick={handleWithdraw} 
                className="w-full bg-green-600 hover:bg-green-500 p-2 rounded"
              >
                {loading ? "Processing..." : "Tarik Dana"}
              </button>
            </div>
            {pending && <div className="mt-4 bg-yellow-600 text-white p-2 rounded text-center">{pendingMessage}</div>}
            {resumedMessage && <div className="mt-4 bg-green-600 text-white p-2 rounded text-center">{resumedMessage}</div>}
            <h3 className="text-lg font-semibold mt-6">Riwayat Transaksi</h3>
            <ul className="bg-gray-700 p-2 rounded mt-2 text-sm">
              {transactionHistory.map((tx, index) => (
                <li key={index} className="border-b border-gray-600 py-1">{tx.date} - ${tx.amount} ({tx.bank} - {tx.accountNumber})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
