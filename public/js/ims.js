$(document).ready(function(){
    $(document).on('click', '.add-var', function(e){
      e.preventDefault();
      var i = 1;
      i++;
      $('#variants').append('<tr id="row'+i+'"><td><select class="custom-select mr-sm-2" id="var-option" name="var-option"><option selected>Choose...</option><option value="Midnight Green">Midnight Green</option><option value="Silver">Silver</option><option value="Space Gray">Space Gray</option><option value="Gold">Gold</option><option value="Rose Gold">Rose Gold</option><option value="White">White</option><option value="Red">Red</option></select></td><td><input id="var-qty'+i+'" class="form-control" type="text" placeholder="Qty" name="qty" required></td><td><button type="button" class="btn btn-remove" id="'+i+'"><i class="fas fa-trash"></i></button></td></tr>');
      // var arr = [];
      // arr[i--] = 
      $(document).on('click', '.btn-remove', function(){
        var button_id = $(this).attr("id");
        $("#row"+button_id+"").remove();
      })
    });
});