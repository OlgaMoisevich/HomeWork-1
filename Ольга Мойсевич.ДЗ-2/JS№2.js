'use strict';

function createTagsField() {
	/** Scope private methods and properties */
	let scope = {
		tags: [],
	};

	/** Private properties */
	const parent = document.createElement('div');
	const input = document.createElement('input');

	parent.classList.add('tags-input');
	input.setAttribute('type', 'text');
	parent.append(input);

	scope.parentHandle = function(event) {
		event = event || window.event;
		if ((event.keyCode === 13) || (event.which === 191) || event.target.value.match(/,/g)) {
			event.preventDefault();
			event.target.value = event.target.value.trim();
			if (event.target.value.length) {
				event.target.value.replace(/,/g, '');
				scope.createTag(event.target.value);
				event.target.value = '';
			}
		}
	};

	parent.addEventListener('keydown', scope.parentHandle);

	scope.createTag = function (text) {
		const tag = {
			text,
			element: document.createElement('span'),
		};
		tag.element.classList.add('tag');
		tag.element.textContent = text;
		scope.tags.push(tag);

		tag.handle = function(event) {
			event.target.removeEventListener('click', tag.handle, false);
			event.target.parentNode.removeChild(event.target);
			let removeIndex = 0;
			scope.tags.forEach(function(element, index) {
				if(element.element === event.target) {
					removeIndex = index;
				}
			});
			scope.tags.splice(removeIndex, 1);
			input.focus();
		};

		parent.insertBefore(tag.element, input);

		tag.element.addEventListener('click', tag.handle, false);
	};

	scope.destroyAllTags = function() {
		scope.tags.forEach(function(tag) {
			tag.element.removeEventListener('click', tag.handle, false);
		});
		scope.tags.splice(0, scope.tags.length);
	};

	scope.destroy = function() {
		parent.removeEventListener('keydown', scope.parentHandle);
		parent.parentNode.removeChild(parent);
		scope.destroyAllTags();
	}

	scope.getTags = function() {
		return scope.tags.map(function(element) {
			return element.text;
		});
	};

	/** Public props & methods */
	return {
		element: parent,
		getTags: scope.getTags,
		destroy: scope.destroy,
	};
}

const tag = createTagsField();
document.body.append(tag.element);