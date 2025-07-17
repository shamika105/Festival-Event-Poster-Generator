/** script.js - Final Improved Version with Full Fixes */

// let currentAudio = null;
// let isMusicPlaying = false;
let historyStack = [];
let redoStack = [];


// ✅ 1. Language Translations (place your code here)
const translations = {
        en: {
          title: "Festival/Event Poster Generator",
          theme: "Choose Theme",
          generate: "Generate Poster",
          share: "Share Poster",
          watermark: "Add Watermark to Poster",
          undo: "Undo",
          redo: "Redo"
        },
        hi: {
          title: "त्योहार/इवेंट पोस्टर जनरेटर",
          theme: "थीम चुनें",
          generate: "पोस्टर बनाएं",
          share: "पोस्टर साझा करें",
          watermark: "वॉटरमार्क जोड़ें",
          undo: "पूर्ववत करें",
          redo: "फिर से करें"
        },
        mr: {
          title: "सण/कार्यक्रम पोस्टर जनरेटर",
          theme: "थीम निवडा",
          generate: "पोस्टर तयार करा",
          share: "पोस्टर शेअर करा",
          watermark: "वॉटरमार्क जोडा",
          undo: "पूर्वस्थिती",
          redo: "पुन्हा करा"
        }
      };
      
      // ✅ 2. Translation logic
      function applyTranslations(lang) {
        const t = translations[lang];
        document.getElementById('appTitle').textContent = t.title;
        document.getElementById('themeLabel').textContent = t.theme;
        document.getElementById('generateBtn').textContent = t.generate;
        document.getElementById('shareBtn').textContent = t.share;
        document.getElementById('watermarkLabel').textContent = t.watermark;
        document.getElementById('undoBtn').textContent = t.undo;
        document.getElementById('redoBtn').textContent = t.redo;
      }
      
      // ✅ 3. Language dropdown change event
      document.getElementById('languageSelect').addEventListener('change', function () {
        applyTranslations(this.value);
      });
      
      // ✅ 4. Set default language on page load
      window.onload = () => {
        applyTranslations('en');
      };

// 2. Add the update button state function
function updateUndoRedoButtons() {
        document.getElementById('undoBtn').disabled = historyStack.length <= 1;
        document.getElementById('redoBtn').disabled = redoStack.length === 0;
      }

      // 4. Add applyPosterState() function
function applyPosterState(state) {
        document.getElementById('posterImage').src = state.imageSrc;
        document.getElementById('posterWatermark').style.display = state.watermarkVisible;
        document.getElementById('templateStyle').value = state.selectedStyle;
      }

      document.getElementById('redoBtn').addEventListener('click', () => {
        if (redoStack.length > 0) {
          const next = redoStack.pop();
          historyStack.push(next);
          applyPosterState(next);
        }
        updateUndoRedoButtons();
      });


      function generatePoster() {
        const posterArea = document.getElementById("poster");

        const name = document.getElementById('eventName').value.trim();

        const date = document.getElementById('eventDate').value.trim();

        const time = document.getElementById('eventTime').value.trim();

        const venue = document.getElementById('eventVenue').value.trim();

        const desc = document.getElementById('eventDescription').value.trim();

        const style = document.getElementById('templateStyle').value.trim().toLowerCase();

        const size = document.getElementById('posterSize').value;

        const imageInput = document.getElementById('eventImage');

        const link = document.getElementById('eventLink').value.trim();

      // Template styling logic
        const selectedTemplate = document.querySelector('input[name="template"]:checked').value;

        const qrContainer = document.getElementById('qrCode');
      
        // Apply basic styling
  posterArea.className = ""; // Reset
  posterArea.classList.add(selectedTemplate); // e.g. .template1, .template2

  // Set content
  posterArea.innerHTML = `<h2>${eventName}</h2>`;

        // ✅ Save state before applying changes
        savePosterState();
      
        // ✅ Reset poster classes
        poster.className = 'poster';
      
        // ✅ Add size class
        const sizeClasses = {
          a4: 'poster-size-a4',
          insta: 'poster-size-insta',
          story: 'poster-size-story'
        };
        if (sizeClasses[size]) {
          poster.classList.add(sizeClasses[size]);
        }
      
        // ✅ Add style class
        const allowedStyles = ['dark', 'fun', 'default', 'diwali', 'tech', 'music', 'sport', 'ganesh'];
        if (allowedStyles.includes(style)) {
          poster.classList.add(`preview-${style}`);
        } else {
          poster.classList.add('preview-default');
        }
      
        // ✅ Update poster text
        document.getElementById('posterTitle').textContent = name || 'Event Name';

        document.getElementById('posterDate').textContent = "📅 " + (date || 'Date');

        document.getElementById('posterTime').textContent = "⏰ " + (time || 'Time');

        document.getElementById('posterVenue').textContent = "📍 " + (venue || 'Venue');
        
        document.getElementById('posterDesc').textContent = "💬 " + (desc || 'Description');
      
        // ✅ Handle QR Code
        qrContainer.innerHTML = '';
        if (link) {
          new QRCode(qrContainer, {
            text: link,
            width: 100,
            height: 100,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
          document.getElementById('qrLabel').style.display = 'block';
        } else {
          document.getElementById('qrLabel').style.display = 'none';
        }
      
        // ✅ Handle image
        const posterImage = document.getElementById('posterImage');
        if (imageInput.files && imageInput.files[0]) {
          const reader = new FileReader();
          reader.onload = function (e) {
            posterImage.src = e.target.result;
            posterImage.style.display = 'block';
          };
          reader.readAsDataURL(imageInput.files[0]);
        } else {
          if (['diwali', 'tech', 'music', 'sport', 'ganesh'].includes(style)) {
            posterImage.style.display = 'none';
          } else {
            posterImage.src = 'images/default.jpg';
            posterImage.style.display = 'block';
          }
        }
      }
      
      
      // Download Poster
      function downloadPoster() {
        const poster = document.getElementById('poster');
      
        html2canvas(poster, {
          allowTaint: true,
          useCORS: true,
          scale: 5, // High-res
          logging: false,
          width: poster.offsetWidth,
  height: poster.offsetHeight
        }).then(canvas => {
          const link = document.createElement('a');
          link.download = 'posterr.png';
          link.href = canvas.toDataURL('images/png');  // ✅ Correct MIME type
          link.click();
        }).catch(error => {
          console.error("Download failed: ", error);
          alert("Failed to download poster. Please try again.");
        });
      }

//       let isPlaying = false;
//       function toggleMusic() {
//         const audio = document.getElementById('bgMusic');
      
//         if (isPlaying) {
//           audio.pause();
//         } else {
//           audio.play();
//         }
      
//         isPlaying = !isPlaying;
//       }

//       function toggleMusic() {
//         const toggleBtn = document.getElementById('musicToggle');
      
//         if (isMusicPlaying) {
//           if (currentAudio) currentAudio.pause();
//           toggleBtn.textContent = '🔇 Music Off';
//         } else {
//           if (currentAudio) currentAudio.play();
//           toggleBtn.textContent = '🔊 Music On';
//         }
      
//         isMusicPlaying = !isMusicPlaying;
//       }
      

      function enableInlineEditing() {
        document.querySelectorAll('[contenteditable]').forEach(el => {
          el.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
              e.preventDefault(); // Prevent new lines
            }
          });
        });
      }

      document.getElementById('templateStyle').addEventListener('change', () => {
        generatePoster(); // Reapply theme and switch music
      });

      document.getElementById('shareBtn').addEventListener('click', async () => {
        const posterURL = document.getElementById('posterImage').src;
      
        try {
          if (navigator.share) {
            await navigator.share({
              title: 'Festival Poster',
              text: 'Check out the poster I created!',
              url: posterURL
            });
            console.log('Poster shared successfully');
          } else {
            alert('Your browser doesn’t support the Web Share API. Try using WhatsApp or Twitter buttons instead.');
          }
        } catch (err) {
          console.error('Sharing failed:', err);
        }
      });

//       save poster state

      function savePosterState() {
        const currentPoster = {
          imageSrc: document.getElementById('posterImage').src,
          watermarkVisible: document.getElementById('posterWatermark').style.display,
          selectedStyle: document.getElementById('templateStyle').value
          // Add more if needed (text, audio, etc.)
        };
        historyStack.push(currentPoster);
        redoStack = []; // Clear redo stack on new action
        updateUndoRedoButtons();
      }
