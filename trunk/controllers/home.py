from framework.controller import *
import giveaminute.location as mLocation
import giveaminute.user as mUser
import giveaminute.project as mProject

class Home(Controller):
    def GET(self, action=None):
        self.template_data['user'] = dict(json = self.json(mUser.getDummyDictionary()),
                                            is_admin = True,
                                            is_moderator = True,
                                            is_leader = True)
        self.template_data['project_user'] = dict(is_member = True,
                                                is_project_admin = True)                                            
        if (not action or action == 'home'):
            return self.showHome()
        elif (action == 'project'):
            return self.showProject()                                        
        else:
            return self.render(action)
            
            
    def POST(self, action=None):
        if (action == 'login'):
            email = self.request('email')
            password = self.request('password')
            
            if (email and password):
                return True
            else:
                return False
         
            return True
        elif (action == 'logout'):
            return True
        else:
            return self.not_found()
            
            
    def showHome(self):
        locations = self.json(mLocation.getSimpleLocationDictionary(self.db))
        
        self.template_data['locations'] = locations
        self.template_data['all_ideas'] = self.json(self.getAllProjectIdeas())
        
        return self.render('home',  {'locations':locations})    
        
    def showProject(self):
        project_id = 1
        project = mProject.Project(self.db, project_id)
        
        self.template_data['project'] = dict(json = self.json(project.getFullDictionary()))
    
        return self.render('project')
        
    def getAllProjectIdeas(self):
        data = []
        
        data.append(self.getProjectIdeas(1, 50))
        data.append(self.getProjectIdeas(2, 30))
        data.append(self.getProjectIdeas(3, 30))
        data.append(self.getProjectIdeas(4, 30))
        data.append(self.getProjectIdeas(5, 15))
        
        return data
        
    def getProjectIdeas(self, index, num):
        data = []
        
        for i in range(num):
            data.append(dict(text = "More Trees in New York City would be awesome and it would totally help to make it way more green! Let's plant some!",
                            f_name = "John",
                            l_name = "Smith",
                            submitted_by = "web"))
            
        return data
        