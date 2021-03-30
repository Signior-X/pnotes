const byId = function( id ) { return document.getElementById( id ); }
const hideEl = function( ele ) { ele.classList.add("hidden"); }
const showEl = function( ele ) { ele.classList.remove("hidden"); }
const hideEls = function( eles ) {
  // Provide the list of elements you want's to have the display as none
  for(const ele of eles) hideEl(ele);
}
const showEls = function( eles ) {
  // Provide the list of elements you want's to have the display as none
  for (const ele of eles) showEl(ele);
}