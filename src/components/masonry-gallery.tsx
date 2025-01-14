import { createSignal, For, onCleanup, onMount, untrack } from "solid-js";
import "./masonry-gallery.css";

export default function MasonryGallery() {
  interface Image {
    url: string;
    offsetX?: number;
    offsetY?: number;
    width?: number;
    height?: number;
  }

  const imageWidth = 200;
  const marginX = 10;
  const marginY = 15;

  const componentMarginTop = 30;
  const componentMarginLeft = 30;
  const componentMarginRight = 30;

  const [windowWidth, setWindowWidth] = createSignal(0);
  const [imagesPerRow, setImagesPerRow] = createSignal(1);

  const [images, setImages] = createSignal<Image[]>([
    {
      url: "https://images.unsplash.com/photo-1529026146391-99c445f79401?q=80&w=2535&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1616615200447-b72e797919ee?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1544376543-c3dd0266dc86?q=80&w=2573&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1616615200388-92fbff5c396a?q=80&w=2671&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1536818393870-35e7634f29e8?q=80&w=2474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://plus.unsplash.com/premium_photo-1667238828892-2e38003ca463?q=80&w=1755&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1643478864528-1d5e73e27d99?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1736796310381-d5c82ce99826?q=80&w=2578&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1731432248706-a87c0cd386d9?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1735263759278-ed793ef6f1e7?q=80&w=2536&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1735436094320-c161c34ae5e0?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1736762046814-678901a05bd3?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1736192326255-89d26db112c3?q=80&w=2536&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      url: "https://images.unsplash.com/photo-1736608332755-d0a1be241cee?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ]);

  function updateValues(index: number, image: Image) {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...image } : img))
    );
  }

  let galleryRef: HTMLDivElement;

  function adjustGallery() {
    let tempImages: Image[] = [];
    let precomputedHeights: number[] = [];
    const gallery = galleryRef.querySelectorAll("img");

    const processImages = () => {
      for (let i = 0; i < gallery.length; i += 1) {
        let rowNumber = Math.floor(i / untrack(() => imagesPerRow()));
        let columnNumber = i % untrack(() => imagesPerRow());

        let newOffsetY = 0;
        for (let j = rowNumber; j >= 0; j--) {
          newOffsetY += precomputedHeights[i - imagesPerRow() * (j + 1)] ?? 0;
        }

        const cumulativeMarginX = columnNumber * marginX + componentMarginLeft;
        const cumulativeMarginY = rowNumber * marginY + componentMarginTop;

        tempImages[i] = {
          url: images()[i].url,
          width: imageWidth,
          height: precomputedHeights[i],
          offsetX: columnNumber * imageWidth + cumulativeMarginX,
          offsetY: newOffsetY + cumulativeMarginY,
        };
        updateValues(i, tempImages[i]);
      }
    };

    // Get image dimensions when images are loaded
    let loadedImagesCount = 0;
    gallery.forEach((img, index) => {
      img.onload = () => {
        precomputedHeights[index] = Math.round(
          (imageWidth / img.naturalWidth) * img.naturalHeight
        );

        loadedImagesCount++;
        if (loadedImagesCount === gallery.length) {
          processImages();
        }
      };

      // If image is cached already
      if (img.complete) {
        img.onload?.(new Event("load"));
      }
    });
  }

  function handleResize() {
    setWindowWidth(window.innerWidth);
    let imgsPerRow = Math.floor(
      (windowWidth() - (componentMarginLeft + componentMarginRight)) /
        (imageWidth + marginX)
    );
    if (imgsPerRow === 0) {
      imgsPerRow = 1;
    }
    setImagesPerRow(imgsPerRow);
    adjustGallery();
  }

  onMount(() => {
    window.addEventListener("resize", handleResize);
    onCleanup(() => window.removeEventListener("resize", handleResize));
    handleResize();
  });

  return (
    <div ref={(el) => (galleryRef = el)} class="masonry-gallery">
      <For each={images()}>
        {(image) => (
          <div
            style={{
              width: `${image.width}px`,
              height: `${image.height}px`,
              top: `${image.offsetY}px`,
              left: `${image.offsetX}px`,
            }}
          >
            <img src={image.url} />
          </div>
        )}
      </For>
    </div>
  );
}
