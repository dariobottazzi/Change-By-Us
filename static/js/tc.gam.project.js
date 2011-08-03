/**
 * File: Project
 * This file ....
 *
 * Filename:
 * tc.game.project.js
 * 
 * Dependencies:
 * - tc.gam.base.js
 * - tc.utils.js
 * - tc.gam.app.js
 */

/**
 * Variable: tc.gam.project_widgets
 * Container for project widgets.
 */
tc.gam.project_widgets = tc.gam.project_widgets || {};

/**
 * Function: tc.gam.project
 * Project object for  ....
 *
 * Parameters:
 * options - {Object} Object of options
 *
 * Returns:
 * {Object} ??
 */
tc.gam.project = function(options) {
    var hash_onload;
    var me = this;
    var this_project = this;

    // Combine options (this is currently unnecessary).
    this.options = tc.jQ.extend({}, options);

    // Define local properties.
    this.dom = this.options.dom;
    this.event_data = {
        project: this
    };
    this.data = this.options.data;
    this.widget = new tc.gam.widget(null, this);

    // Get hash location.
    hash_onload = window.location.hash;

    // Components of the project interface.
    this.components = {
        'infopane': new tc.gam.project_widgets.infopane(this, this.dom.find('.box.mission'),
            { widget: this.widget }, { app: options.app }),
        'resources': new tc.gam.project_widgets.resources(this, this.dom.find('.box.resources'),
            { widget: this.widget }, { app: options.app }),
        'related_resources': new tc.gam.project_widgets.related_resources(this, this.dom.find('.box.related-resources'),
            { widget: this.widget }, { app: options.app }),
        'add_link': new tc.gam.project_widgets.add_link(this, this.dom.find('.box.add-link'),
            { widget: this.widget }, { app: options.app }),
        'goals_main': new tc.gam.project_widgets.goals_main(this, this.dom.find('.box.goals-main'),
            { widget: this.widget }, { app: options.app }),
        'goals_add': new tc.gam.project_widgets.goals_add(this, this.dom.find('.box.goals-add'),
            { widget: this.widget }, { app: options.app }),
        'conversation': new tc.gam.project_widgets.conversation(this, this.dom.find('.box.conversation'),
            { widget: this.widget }, { app: options.app }),
        'members': new tc.gam.project_widgets.members(this, this.dom.find('.box.members'),
            { widget: this.widget }, { app: options.app })
    };

    // Add fresh ideas component if available.
    if (tc.gam.project_widgets.fresh_ideas) {
        this.components.related_ideas = new tc.gam.project_widgets.fresh_ideas(this,
            this.dom.find('.box.fresh-ideas'), { widget: this.widget }, { app: options.app });
    }

    // Add goals stack if available
    if (tc.gam.project_widgets.goals_stack) {
        this.components.goals_stack = new tc.gam.project_widgets.goals_stack(this, 
            this.dom.find('.box.goals-stack-holder'), { widget: this.widget }, { app: options.app });
    }

    /**
     * Function: tc.gam.project.go_home
     * Return project page to initial state.
     *
     * Parameters:
     * e - ??
     */
    this.go_home = function (e) {
        if (e) {
            e.data.project.components.goals_main.show(false);
            e.data.project.components.conversation.show(false);

            if (tc.gam.project_widgets.goals_stack) {
                e.data.project.components.goals_stack.hide(false);
            }
            if (tc.gam.project_widgets.members) {
                e.data.project.components.members.hide(false);
            }
            e.data.project.components.goals_add.hide(false);
            e.data.project.components.add_link.hide(false);
            e.data.project.components.related_resources.hide(false);
        } else {
            this.components.goals_main.show(false);
            this.components.conversation.show(false);
        }
    }

    this.handlers = {
        widget_show: function (e, d) {
            tc.util.dump(d.name);
            switch (d.name) {
            case 'members':
                e.data.project.components.goals_main.hide(false);
                if (tc.gam.project_widgets.goals_stack) {
                    e.data.project.components.goals_stack.hide(false);
                }
                e.data.project.components.goals_add.hide(false);
                e.data.project.components.conversation.hide(false);
                e.data.project.components.add_link.hide(false);
                break;
            case 'goals_add':
                e.data.project.components.goals_main.hide(false);
                break;
            case 'goals_stack':
                e.data.project.components.goals_add.hide(false);
                e.data.project.components.goals_main.hide(false);
                break;
            case 'related_resources':
                e.data.project.components.goals_main.hide(false);
                if (tc.gam.project_widgets.goals_stack) {
                    e.data.project.components.goals_stack.hide(false);
                }
                e.data.project.components.members.hide(false);
                e.data.project.components.conversation.hide(false);
                e.data.project.components.add_link.hide(false);
                break;
            case 'add_link':
                e.data.project.components.goals_main.hide(false);
                if (tc.gam.project_widgets.goals_stack) {
                    e.data.project.components.goals_stack.hide(false);
                }
                e.data.project.components.members.hide(false);
                e.data.project.components.conversation.hide(false);
                e.data.project.components.related_resources.hide(false);
                break;
            }
        },
        widget_hide: function (e, d) {
            tc.util.dump('project.widget_hide');
            switch (d.name) {
            case 'members':
            case 'goals_add':
            case 'goals_stack':
            case 'related_resources':
            case 'add_link':
                this_project.go_home(e);
                break;
            }
        },
        hashchange: function (e) {
            tc.util.log('tc.project.handlers.hashchange');
            var hash;
            hash = window.location.hash.substring(1, window.location.hash.length);
            if (hash == 'project-home') {
                e.preventDefault();
                this_project.go_home(e);
                return;
            }
            switch (hash.split(',')[0]) {
            case 'show':
                e.preventDefault();
                tc.util.dump(hash.split(',')[1]);
                if (e.data.project.components[hash.split(',')[1]]) {
                    e.data.project.components[hash.split(',')[1]].show();
                }
                break;
            case 'hide':
                e.preventDefault();
                if (e.data.project.components[hash.split(',')[1]]) {
                    e.data.project.components[hash.split(',')[1]].hide();
                }
                break;
            }
        },
        idea_remove: function (e, d) {
            if (e.data.project.components.related_ideas) {
                e.data.project.components.related_ideas.remove_idea(d.id);
            }
            e.data.project.components.members.remove_idea(d.id);
        }
    };

    this.update_goals = function () {
        tc.jQ.ajax({
            type: 'GET',
            url: '/project/goals',
            data: {
                project_id: me.data.project_id
            },
            context: me,
            dataType: 'text',
            success: function (data, ts, xhr) {
                var d;
                try {
                    d = tc.jQ.parseJSON(data);
                } catch (e) {
                    return;
                }
                this.dom.trigger("goals-refresh", [d]);
            }
        });
    };

    tc.jQ(window).bind('hashchange', this.event_data, this.handlers.hashchange);
    this.dom.bind('project-widget-show', this.event_data, this.handlers.widget_show);
    this.dom.bind('project-widget-hide', this.event_data, this.handlers.widget_hide);
    this.dom.bind('project-idea-remove', this.event_data, this.handlers.idea_remove);

    window.location.hash = hash_onload;
    tc.jQ(window).trigger('hashchange');
};


tc.gam.widget = function (inheritor, project) {
    if (!inheritor) {
        return;
    }

    inheritor.show = function (propagate) {
        if (inheritor.dom) {
            inheritor.dom.show();
        }
        if (propagate !== false) {
            project.dom.trigger('project-widget-show', {
                name: inheritor.options.name
            });
        }
    };

    inheritor.hide = function (propagate) {
        if (inheritor.dom) {
            inheritor.dom.hide();
        }
        if (propagate !== false) {
            project.dom.trigger('project-widget-hide', {
                name: inheritor.options.name
            });
        }
    };

    return inheritor;
};