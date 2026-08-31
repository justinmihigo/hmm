import { useEffect } from 'react';

export default function InstagramReel() {
  useEffect(() => {
    // This loads Instagram's native player script
    if (!(window as any).instgrm) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.instagram.com/embed.js';
      document.body.appendChild(script);
    } else {
      // If the script is already loaded, tell it to process new embeds
      (window as any).instgrm.Embeds.process();
    }
  }, []);

  return (
    <div className="classes-video-block">
      <div className="home-of-dance-video">
        <blockquote
          className="instagram-media"
          data-instgrm-permalink= "https://www.instagram.com/reel/DWgZhyqDAXw"
          data-instgrm-version="14"
          style={{
            background: '#0c0c0b',
            border: '0',
            margin: '0',
            maxWidth: '100%',
            width: '100%',
            padding: '0',
          }}
        >
          {/* Instagram injects the high-res video player right here */}
        </blockquote>
      </div>
    </div>
  );
}