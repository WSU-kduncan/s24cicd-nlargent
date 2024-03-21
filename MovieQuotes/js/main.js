var rhit = rhit || {};

rhit.FB_COLLECTION_MOVIEQUOTE = "MovieQuotes";
rhit.FB_KEY_QUOTE = "quote";
rhit.FB_KEY_MOVIE = "movie";
rhit.FB_KEY_LAST_TOUCHED = "lastTouched";
rhit.fbMovieQuotesManager = null;
rhit.fbSingleQuoteManager = null;

function htmlToElement(html) {
	var template = document.createElement("template");
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

rhit.ListPageController = class {
	constructor(){
		document.querySelector("#submitAddQuote").addEventListener("click", (event) =>{
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbMovieQuotesManager.add(quote, movie);
		})

		$("#addQuoteModal").on("show.bs.modal", (error) => {
			// Pre animation
			document.querySelector("#inputQuote").value = "";
			document.querySelector("#inputMovie").value = "";
		})

		$("#addQuoteModal").on("shown.bs.modal", (error) => {
			// Post animation
			document.querySelector("#inputQuote").focus();
		})
		
		// Start listening
		rhit.fbMovieQuotesManager.beginListening(this.updateList.bind(this));
	}

	_createCard(movieQuote){
		return htmlToElement(`<div class="card">
		<div class="card-body">
		  <h5 class="card-title">${movieQuote.quote}</h5>
		  <p class="card-text">${movieQuote.movie}</p>
		</div>
	  </div>`);
	}

	updateList(){
		console.log("I need to update list");
		console.log(`Num quotes = ${rhit.fbMovieQuotesManager.length}`);
		console.log("Example quote = ", rhit.fbMovieQuotesManager.getMovieQuoteAtIndex(0));

		// Make a new quoteListContainer
		const newList = htmlToElement('<div id="quoteListContainer"></div>');
		// Fill the quoteListContainer with quote cards using a loop
		for (let i = 0; i < rhit.fbMovieQuotesManager.length; i++){
			const mq = rhit.fbMovieQuotesManager.getMovieQuoteAtIndex(i);
			const newCard = this._createCard(mq);

			newCard.onclick = (event) => {
				// console.log(`You clicked on ${mq.id}`);
				// rhit.storage.setMovieQuoteId(mq.id);
				window.location.href = `/moviequote.html?id=${mq.id}`;
			}
			newList.appendChild(newCard);
		}

		// Remove the old quoteListContainer
		const oldList = document.querySelector("#quoteListContainer");
		oldList.removeAttribute("id");
		oldList.hidden = true;
		// Put in the new quoteListContainer
		oldList.parentElement.appendChild(newList);
	}
}

rhit.MovieQuote = class {
	constructor(id, quote, movie){
		this.id = id;
		this.quote = quote;
		this.movie = movie;
	}
}

rhit.FbMovieQuotesManger = class {
	constructor(){
		console.log("created FbMovieQuotesManger");
		this._documentSnapshots = [];
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE); // FB_MOVIEQUOTE_COLLECTION
		this._unsubsribe = null;
	}
	add(quote, movie){
		console.log(`add quote ${quote}`);
		console.log(`add movie ${movie}`);
		this._ref.add({
			[rhit.FB_KEY_QUOTE]: quote,
			[rhit.FB_KEY_MOVIE]: movie,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function (docRef) {
			console.log("Document written with ID: ", docRef.id);
		})
		.catch(function (error){
			console.error("Error adding document: ", error);
		})
	}
	beginListening(changeListener){
		this.unsubscribe = this._ref.orderBy(rhit.FB_KEY_LAST_TOUCHED, "desc").limit(50).onSnapshot((querySnapshot) => {
			console.log("Movie Quote Update!");
			this._documentSnapshots = querySnapshot.docs;
			// querySnapshot.forEach((doc) => {
			// 	console.log(doc.data());
			// });
			changeListener();
		});
	}
	stopListening(){
		this._unsubsribe();
	}
	// update(id, quote, movie){}
	// delete(id){}
	get length(){
		return this._documentSnapshots.length;
	}
	getMovieQuoteAtIndex(index){
		const docSnapshot = this._documentSnapshots[index];
		const mq = new rhit.MovieQuote(
			docSnapshot.id, 
			docSnapshot.get(rhit.FB_KEY_QUOTE),
			docSnapshot.get(rhit.FB_KEY_MOVIE)
		);
		return mq;
	}
}

rhit.DetailPageController = class {
	constructor(){
		document.querySelector("#submitEditQuote").addEventListener("click", (event) =>{
			const quote = document.querySelector("#inputQuote").value;
			const movie = document.querySelector("#inputMovie").value;
			rhit.fbSingleQuoteManager.update(quote, movie);
		})
		$("#editQuoteModal").on("show.bs.modal", (error) => {
			// Pre animation
			document.querySelector("#inputQuote").value = rhit.fbSingleQuoteManager.quote;
			document.querySelector("#inputMovie").value = rhit.fbSingleQuoteManager.movie;
		})
		$("#editQuoteModal").on("shown.bs.modal", (error) => {
			// Post animation
			document.querySelector("#inputQuote").focus();
		})
		document.querySelector("#submitDeleteQuote").addEventListener("click", (event) =>{
			rhit.fbSingleQuoteManager.delete();
			rhit.fbSingleQuoteManager.delete().then(() => {
				console.log("Deleted!");
				window.location.href = "/";
			}).catch((error) => {
				console.log("Error deleting: ", error);
			})
		})
		console.log("Made the detail page controller");
		rhit.fbSingleQuoteManager.beginListening(this.updateView.bind(this));
	}
	updateView(){
		document.querySelector("#cardQuote").innerHTML = rhit.fbSingleQuoteManager.quote;
		document.querySelector("#cardMovie").innerHTML = rhit.fbSingleQuoteManager.movie; 
		
	}
}

rhit.FbSingleQuoteManager = class {
	constructor(movieQuoteId){
		this._documentSnapshot = {}
		this.unsubscribe = null;
		this._ref = firebase.firestore().collection(rhit.FB_COLLECTION_MOVIEQUOTE).doc(movieQuoteId);
		console.log(`Listing to ${this._ref.path}`);
	}
	beginListening(changeListener){
		this._unsubsribe = this._ref.onSnapshot((doc) =>{
			if (doc.exists){
				console.log("Document data:", doc.data());	
				this._documentSnapshot = doc;
				changeListener();
			}else{
				// window.location.href = "/";
			}
		});
	}
	stopListening(){
		this._unsubsribe();
	}
	update(quote, movie){
		this._ref.update({
			[rhit.FB_KEY_QUOTE]: quote,
			[rhit.FB_KEY_MOVIE]: movie,
			[rhit.FB_KEY_LAST_TOUCHED]: firebase.firestore.Timestamp.now(),
		})
		.then(function() {
			console.log("Document updated!");
		})
		.catch(function (error){
			console.error("Error adding document: ", error);
		})
	}
	delete(){
		return this._ref.delete();
	}
	get quote(){
		return this._documentSnapshot.get(rhit.FB_KEY_QUOTE);
	}
	get movie(){
		return this._documentSnapshot.get(rhit.FB_KEY_MOVIE);
	}
}


/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");

	if (document.querySelector("#listPage")){
		console.log("You are on the list page");
		rhit.fbMovieQuotesManager = new rhit.FbMovieQuotesManger();
		new rhit.ListPageController();
	}

	if (document.querySelector("#detailPage")){
		console.log("You are on the detail page");
		// const movieQuoteId = rhit.storage.getMovieQuoteId();
		const queryString = window.location.search;
		console.log(queryString);
		const urlParams = new URLSearchParams(queryString);
		const movieQuoteId = urlParams.get("id");
		console.log(`Detail page for ${movieQuoteId}`);
		if (!movieQuoteId){
			console.log("Error! Missing movieQuoteId");
			window.location.href = "/";
		}
		rhit.fbSingleQuoteManager = new rhit.FbSingleQuoteManager(movieQuoteId);
		new rhit.DetailPageController();
	}


};

rhit.main();
