# 🌊 StreamWave TV

**StreamWave TV** is a modern web application for browsing and watching live TV channels from around the world through publicly available IPTV streams.

🌐 **Live Website:** https://streamwavetv.online

The platform provides a fast, Netflix-style interface to explore channels by region and category, search channels instantly, and stream them directly in the browser.

---

## ✨ Features

### 📺 Live Channel Streaming

* Watch live IPTV channels directly in the browser.
* Supports **HLS (.m3u8) streams** using **Hls.js**.
* Automatic playback and buffering handling.

### 🌍 Smart Region Detection

* Automatically detects the user's region based on IP.
* Shows channels available for the detected country.

### 🔎 Instant Channel Search

* Real-time search for channels.
* Results update dynamically as you type.

### 📊 Trending Channels

* Tracks channel popularity using **Redis sorted sets**.
* Displays trending channels globally and per region.

### ⚡ Fast Performance

* Built using **Next.js App Router**.
* Optimized server rendering and caching.
* Redis used for analytics and trending logic.

### 📱 Responsive UI

* Works smoothly on desktop and mobile.
* Mobile navigation drawer and optimized video player controls.

### 🎥 Custom Video Player

* HLS streaming support.
* Playback controls including:

  * Play / Pause
  * Volume slider
  * Fullscreen
  * Timeline seek bar
  * Buffering indicators

---

## 🧱 Tech Stack

| Technology                  | Usage                              |
| --------------------------- | ---------------------------------- |
| **Next.js 15 (App Router)** | Fullstack React framework          |
| **TailwindCSS**             | Styling                            |
| **Hls.js**                  | Streaming HLS video                |
| **Upstash Redis**           | Trending analytics & deduplication |
| **Axios**           | API requests                       |
| **Vercel**                  | Deployment & hosting               |

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── viewCount/
│   │       └── route.js
│   ├── channel/
│   ├── play/
│   ├── search/
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── Navbar.js
│   ├── Section.js
│   └── Channel.js
│
├── utils/
│   ├── Stream.js
│   └── Loader.js
│
├── lib/
│   ├── redis.js
│   └── trending.js
```

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/streamwavetv.git
cd streamwavetv
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create environment variables

Create a `.env.local` file:

```
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### 4️⃣ Run the development server

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

#### Note:- Before using the application, you will need to change the base url that was used to fetch the trending channels in src/app/page.js as per your need

---

## 📡 Data Sources

This project uses public IPTV metadata from:

* https://github.com/iptv-org/iptv

Used datasets include:

* `channels.json`
* `streams.json`
* `categories.json`
* `logos.json`
* `countries.json`

---

## ⚠️ Legal Notice

StreamWave TV **does not host or own any media streams**.

The platform only aggregates publicly available IPTV streams and metadata.

Some streams may be:

* geo-restricted
* unavailable
* DRM protected

Streams that require DRM or encryption are intentionally **not supported**.

---

## 📈 Future Improvements

Planned features include:

* Channel program schedules (EPG)
* Better SEO indexing
* Channel popularity ranking improvements
* Improved caching strategies
* More advanced anti-spam analytics
* Channel recommendations

---

## 👨‍💻 Author

Created by **Saksham Vitwekar**

GitHub: https://github.com/SomeTroller77

---

## ⭐ Support

If you like this project:

* ⭐ Star the repository
* 🍴 Fork it
* 🧑‍💻 Contribute improvements

---
