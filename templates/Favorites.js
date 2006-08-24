BitMap.Map.prototype.RequestFaves = function(){
  //make ajax request
  //initiate loading graphic
  //set callback ReceiveFaves
  //else report error
  //clear loading graphic
}
BitMap.Map.prototype.ReceiveFaves = function(){
  //add data to marker array
  //create markers
    //add to map
    //add to favorites list
  //display favorites list
}
BitMap.Map.prototype.StoreToFaves = function(){
  //format data
  //make ajax request
  //initiate storing graphic
  //set callback UpdateFavesList
  //else report error
  //clear storing graphic
}
BitMap.Map.prototype.ExpungeFromFaves = function(){
  //make ajax request
  //initiate expunging graphic
  //set callback UpdateFavesList
  //else report error
  //clear expunging graphic
}
BitMap.Map.prototype.UpdateFavesList = function(){
  //if store
    //set marker status to favorite
    //unattach and attach with new icon
    //remove from general side panel list
    //add to favorites side panel list
  //if expunge
    //set marker status to unmarked
    //unattach and attach with new icon
    //remove from favorites side panel list
    //add to general side panel list
  //else report server error
}
BitMap.Map.prototype.Bookmark = function(){
  //set marker status to bookmarked
  //unattach and attach with new icon
  //remove from general side panel list
  //add to bookmarks side panel list   
  //if bookmarks side panel list is hidden show it
}
BitMap.Map.prototype.ExpungeFromBookmark = function(){
  //set marker status to unmarked
  //unattach and attach with new icon
  //remove from bookmarks panel list
  //add to general side panel list
  //if bookmarks side panel list is empty hide it
}
BitMap.Map.prototype.ClearBookmarks = function(){
  //set markers status to unmarked
  //unattach and attach with new icon
  //remove from bookmarks panel list
  //add to general side panel list
  //hide bookmarks panel
}
