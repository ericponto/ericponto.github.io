/**
 * jQuery like DOM class
 * @class
 */
class DOM {
	/**
	 * create a new array like object of elements
	 * @constructor
	 */
	constructor( selector ) {
		var elements = document.querySelectorAll(selector);
		
		this.length = elements.length;
		
		Object.assign(this, elements);
	}
	
	/**
	 * @param {Function} callback A callback to call on each element
	 */
	each( callback ) {
		// convert this to Array to use for...of
		for ( let el of Array.from(this) ) {
			callback.call( el );
		}
		
		// return this for chaining
		return this;
	}
	
	/**
	 * Add a class to selected elements
	 * @param {String} className The class name to add
	 */
	addClass( className ) {
		return this.each(function() {
			this.classList.add(className);
		});
	}
	
	/**
	 * Remove a class from selected elements
	 * @param {String} className The class name to remove
	 */
	removeClass( className ) {
		return this.each(function() {
			this.classList.remove(className);
		});
	}
	
	/**
	 * Check to see if the element has a class
	 * (Note: Only checks the first elements if more than one is selected)
	 * @param {String} className The class name to check
	 */
	hasClass( className ) {
		return this[0].classList.contains(className);
	}
	
	/**
	 * Attach an event listener with a callback to the selected elements
	 * @param {String} event Name of event, eg. "click", "mouseover", etc...
	 * @param {Function} callback The function to call when the event is triggered
	 */
	on( event, callback ) {
		return this.each(function() {
			this.addEventListener(event, callback, false);
		});
	}
};

export var $ = selector => new DOM(selector);