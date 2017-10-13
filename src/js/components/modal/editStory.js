editStoryModal = (function() {
	let _storyJsonEdited;

	function removeDetails() {
		$('#editDetails').remove();
		$('#editModal').find('.modal-save').remove();
	}

	function renderDetails(teamId, storyJson) {
        let editModal = $('#editModal'),
            modalTitle = editModal.find('.modal-title'),
            modalBody = editModal.find('.modal-body'),
			isNewStory = storyJson ? false : true,
			editDetails,
			nameInput,
			pointsInput,
			teamInput,
            newAcceptanceCriteriaInput,
            addCriteriaButton;

		modalTitle.text(isNewStory ? 'Add Story' : 'Edit Story' );

		_storyJsonEdited = storyJson ? storyJson : {name: "New Story", points: "", teamId: teamId, tasks: []};
		editDetails = $('<div>').attr('id', 'editDetails').appendTo(modalBody);

        nameInput = $('<textarea>')
            .addClass('input form-control')
            .attr('placeholder', 'Story Name')
			.attr('id', 'storyName')
            .appendTo(editDetails)
            .val(_storyJsonEdited.name)
            .on('input', function() {
                _storyJsonEdited.name = nameInput.val();
            });

		pointsInput = $('<input>')
			.addClass('input form-control')
			.attr('placeholder', 'Story Points')
            .attr('id', 'storyPoints')
			.appendTo(editDetails)
			.val(_storyJsonEdited.points)
			.on('input', function() {
				_storyJsonEdited.points = parseInt(pointsInput.val());
			});

		$('<h6>').text('Choose a team/board').appendTo(editDetails);
		teamInput = $('<select>')
            .attr('data-live-search', 'true')
            .attr('id', 'storyTeam')
            .appendTo(editDetails);
		loadTeamOptions(teamInput);
    	teamInput.val(teamId)
			.selectpicker('refresh')
			.change(function() {
				_storyJsonEdited.teamId = teamInput.val();
			});

		$('<br>').appendTo(editDetails);
		$('<h6>').text('Additional Acceptance Criteria').appendTo(editDetails);

		$('<div>').attr('id', 'editCriteriaDiv').appendTo(editDetails);

		if(_storyJsonEdited.acceptanceCriteria) {
			_storyJsonEdited.acceptanceCriteria.forEach(function(criteria) {
				let isChecked = criteria.isChecked === true || criteria.isChecked === "true";
				addCriteria(criteria.name, isChecked);
			});
		}

		newAcceptanceCriteriaInput = $('<textarea>')
			.addClass('input form-control')
            .attr('id', 'addACTextarea')
			.attr('placeholder', 'New criteria')
			.appendTo(editDetails);
		addCriteriaButton = $('<button>')
			.addClass('btn btn-default')
            .attr('id', 'addACButton')
			.text('Add Criteria')
			.appendTo(editDetails)
			.click(function() {
				addCriteria(newAcceptanceCriteriaInput.val());
                newAcceptanceCriteriaInput.val('');
			});

		if (isNewStory && false) {
		    // not ready yet
            $('<h6>Default tasks:</h6>').appendTo(editDetails);
            let defaultTasksDiv = $('<div class="form-control" id="defaultTasks">');
		    function addDefaultTaskCB(id, label) {
		        $(`<div class="form-check input">
                      <label class="form-check-label">
                        <input class="form-check-input" type="checkbox" id="${id}" checked>
                        ${label}
                      </label>
                    </div>`).appendTo(defaultTasksDiv);
            }
            addDefaultTaskCB('cbBrowserTesting', 'Browser testing - Chrome, IE, Edge');
            addDefaultTaskCB('cbCodeReview', 'Code Review');
            addDefaultTaskCB('cbFrontEnd', 'Front End');
            addDefaultTaskCB('cbBackEnd', 'Back End');
            editDetails.append(defaultTasksDiv);
        }
	}

	function addCriteria(criteriaName, isChecked) {
		if(criteriaName) {
			let criteriaNameRow = $('<div>').addClass('row').appendTo('#editCriteriaDiv');
			let criteriaCheckbox = $('<input>').attr('type', 'checkbox').addClass('col-xs-2 criteriaCheckbox').appendTo(criteriaNameRow);
			let criteriaNameDiv = $('<div>').addClass('col-xs-8 criteriaNameDiv').text(criteriaName).appendTo(criteriaNameRow);
			let criteriaDeleteButton = $('<span>').addClass('col-xs-2 glyphicon glyphicon-remove').appendTo(criteriaNameRow);

			if(isChecked) {
				criteriaCheckbox.attr('checked', true);
			}

			criteriaDeleteButton.click(function() {
				criteriaNameRow.remove();
			});
		}
		else {
			alert('Please enter a criteria description.');
		}
	}

	function loadTeamOptions(teamInput) {
		let mainTeamSelector = $('#select-div').children('.bootstrap-select').children('.selectpicker');
		let options = mainTeamSelector.children('option');
		for(let i = 0; i < options.length; i++) {
			let option = options[i];
			let optionText = $(option).text();
			let optionVal = $(option).val();
			let newOption = $('<option>').text(optionText).val(optionVal).appendTo(teamInput)
		}
	}

	function renderSaveButton(callback) {
        let editModal = $('#editModal');
		let modalFooter = editModal.find('.modal-footer');
		let saveButton = $('<button type="button" class="btn btn-primary modal-save">Save</button>').appendTo(modalFooter);

		saveButton.click(function() {
			let acceptanceCriteria = [];
			let acceptanceCriteriaDiv = $('#editCriteriaDiv').children('.row');
			for(let i = 0; i < acceptanceCriteriaDiv.length; i++) {
				let row = $(acceptanceCriteriaDiv[i]);
				acceptanceCriteria.push({
					name: row.children('.criteriaNameDiv').text(),
					isChecked: row.children('.criteriaCheckbox').get()[0].checked
				});
			}
			let defaultTasks = $('#defaultTasks').find('input.form-check-input').toArray().filter(cb => cb.checked).map(cb => cb.id);
			_storyJsonEdited.defaultTasks = defaultTasks;
			_storyJsonEdited.acceptanceCriteria = acceptanceCriteria;
            editModal.modal('hide');
			callback(_storyJsonEdited);
		});

	}

	return {
		open: function(teamId, storyJson, callback) {
			removeDetails();
			renderDetails(teamId, storyJson);
			renderSaveButton(callback);
			$('#editModal').modal('show');
		}
	}
})();