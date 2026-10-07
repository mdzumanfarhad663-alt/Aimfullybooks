(() => {
  const shareButton = document.querySelector('.ty-share-btn');
  const firstOrderItem = document.querySelector('.co-order-item[data-product-url]');
  if (!shareButton || !firstOrderItem) return;

  const productUrl = new URL(firstOrderItem.dataset.productUrl, window.location.href).href;
  shareButton.href = productUrl;

  shareButton.addEventListener('click', async (event) => {
    if (!navigator.share) return;
    event.preventDefault();

    try {
      await navigator.share({
        title: 'Boundless Backer',
        text: 'Crowdfunding needs a crowd. Share this art project with your tribe!',
        url: productUrl,
      });
    } catch (error) {
      if (error.name !== 'AbortError') window.location.href = productUrl;
    }
  });
})();
