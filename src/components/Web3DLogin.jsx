import { useState } from "react";

const users = {
  rahmadani: { password: "nisyaputri03", image: "simulator.png", saldo: 875 },
};

export default function Web3DLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [pending, setPending] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const [resumedMessage, setResumedMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const generateOtp = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

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
        setPendingMessage("Penarikan sedang pending, transaksi akan mulai dicairkan kembali 6 April 2025.");
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 font-sans">
      <div className="container w-full max-w-lg p-6 bg-gray-800 text-white rounded-2xl shadow-lg">
        {!loggedIn ? (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div className="space-y-4">
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray-700 border-none w-full p-2 rounded" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-700 border-none w-full p-2 rounded" />
              <button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded">{loading ? "Loading..." : "Login"}</button>
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Welcome, {username}!</h2>
            <img src={image} alt="Simulator" className="w-full rounded-lg mb-4" />
            <p className="text-center text-lg font-medium">Saldo Anda:</p>
            <p className="text-center text-2xl font-bold mt-1">${saldo}</p>
            <div className="space-y-4 mt-4">
              <select value={bank} onChange={(e) => setBank(e.target.value)} className="bg-gray-700 border-none w-full p-2 rounded">
                <option value="">Pilih Bank</option>
                <option value="BCA">BCA</option>
                <option value="BNI">BNI</option>
                <option value="Mandiri">Mandiri</option>
                <option value="BRI">BRI</option>
              </select>
              <input type="text" placeholder="Nomor Rekening" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} className="bg-gray-700 border-none w-full p-2 rounded" />
              <input type="number" placeholder="Jumlah Penarikan" value={withdrawAmount || ""} onChange={(e) => setWithdrawAmount(e.target.value)} className="bg-gray-700 border-none w-full p-2 rounded" />
              <button onClick={handleWithdraw} className="w-full bg-green-600 hover:bg-green-500 p-2 rounded">{loading ? "Processing..." : "Tarik Dana"}</button>
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
