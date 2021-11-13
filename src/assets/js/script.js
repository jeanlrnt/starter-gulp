const exemple = () => console.log(`Message from ${document.scripts[document.scripts.length - 1].src.split('/')[document.scripts[document.scripts.length - 1].src.split('/').length - 1]}`);

exemple();
