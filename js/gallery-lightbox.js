/**
 * GoldenJDM - Shared gallery lightbox
 * Opens .gallery images in the #lightbox overlay with keyboard and
 * prev/next navigation.
 */
(function () {
  var galleryImages = document.querySelectorAll('.gallery img');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('closeBtn');
  if (!galleryImages.length || !lightbox || !lightboxImg || !closeBtn) return;

  var currentIndex = 0;

  galleryImages.forEach(function (img, index) {
    img.addEventListener('click', function () {
      currentIndex = index;
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
    });
  });

  closeBtn.addEventListener('click', function () {
    lightbox.classList.remove('active');
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
  }

  var nextBtn = document.createElement('span');
  var prevBtn = document.createElement('span');
  nextBtn.textContent = '›';
  prevBtn.textContent = '‹';
  [nextBtn, prevBtn].forEach(function (btn) {
    btn.style.position = 'absolute';
    btn.style.top = '50%';
    btn.style.transform = 'translateY(-50%)';
    btn.style.fontSize = '48px';
    btn.style.color = 'white';
    btn.style.cursor = 'pointer';
    btn.style.userSelect = 'none';
    btn.style.padding = '10px';
    btn.style.transition = 'opacity 0.2s';
  });
  nextBtn.style.right = '30px';
  prevBtn.style.left = '30px';
  lightbox.appendChild(nextBtn);
  lightbox.appendChild(prevBtn);

  nextBtn.addEventListener('click', showNext);
  prevBtn.addEventListener('click', showPrev);
})();
