/*When the DOM content is loaded,
 *get the group card template.
 */
document.addEventListener('DOMContentLoaded', ()=>{
    groupTemplate = Handlebars.compile(document.querySelector('#groupCardTemplate').innerHTML)
})
