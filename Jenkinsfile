/**
 * Jenkins build definition. This file defines the entire build pipeline.
 */
import java.net.URLEncoder;
import groovy.json.JsonBuilder
import jenkins.model.Jenkins

DEPLOY_URL = ""
DEPLOY_LOGS = ""

/**
  * PhabConnector handles all communication with phabricator if the build
  * was triggered by a phabricator run.
  */
class PhabConnector {
  def jenkinsCtx
  def URL
  def repository
  def apiToken
  def phid

  def PhabConnector(jenkinsCtx, URL, repository, apiToken, phid) {
    this.jenkinsCtx = jenkinsCtx
    this.URL = URL
    this.repository = repository
    this.apiToken = apiToken
    this.phid = phid
  }

  def harborMasterUrl(method) {
    def url = "${URL}/api/${method}?api.token=${apiToken}" +
            "&buildTargetPHID=${phid}"
    return url
  }

  def sendBuildStatus(build_status) {
    def url = this.harborMasterUrl("harbormaster.sendmessage")
    def body = "type=${build_status}"
    jenkinsCtx.httpRequest consoleLogResponseBody: true,
      contentType: 'APPLICATION_FORM',
      httpMode: 'POST',
      requestBody: body,
      responseHandle: 'NONE',
      url: url,
      validResponseCodes: '200'
  }

  def addArtifactLink(linkURL, artifactKey, artifactName) {
    def encodedDisplayUrl = URLEncoder.encode(linkURL, 'UTF-8')
    def url = this.harborMasterUrl("harbormaster.createartifact")
    def body = ""
    body += "&buildTargetPHID=${phid}"
    body += "&artifactKey=${artifactKey}"
    body += '&artifactType=uri'
    body += "&artifactData[uri]=${encodedDisplayUrl}"
    body += "&artifactData[name]=${artifactName}"
    body += '&artifactData[ui.external]=true'

    jenkinsCtx.httpRequest consoleLogResponseBody: true,
      contentType: 'APPLICATION_FORM',
      httpMode: 'POST',
      requestBody: body,
      responseHandle: 'NONE',
      url: url,
      validResponseCodes: '200'
  }
}

/**
  * We expect the following parameters to be defined (for code review builds):
  *    PHID: Which should be the buildTargetPHID from Harbormaster.
  *    INITIATOR_PHID: Which is the PHID of the initiator (ie. Differential)
  *    API_TOKEN: The api token to use to communicate with Phabricator
  *    REVISION: The revision ID of the Differential.
  */

// NOTE: We use these without a def/type because that way Groovy will treat these as
// global variables.
phabConnector = PhabConnector.newInstance(this, 'https://phab.corp.pixielabs.ai' /*url*/,
                                          'PCD' /*repository*/, params.API_TOKEN, params.PHID)

/**
  * @brief Add build info to harbormaster and badge to Jenkins.
  */
def addBuildInfo = {
  phabConnector.addArtifactLink(env.RUN_DISPLAY_URL, 'jenkins.uri', 'Jenkins')

  def text = ""
  def link = ""
  // Either a revision of a commit to master.
  if (params.REVISION) {
    def revisionId = "D${REVISION}"
    text = revisionId
    link = "${phabConnector.URL}/${revisionId}"
  } else {
    text = params.PHAB_COMMIT.substring(0, 7)
    link = "${phabConnector.URL}/r${phabConnector.repository}${env.PHAB_COMMIT}"
  }
  addShortText(text: text,
    background: "transparent",
    border: 0,
    borderColor: "transparent",
    color: "#1FBAD6",
    link: link)
}

def isPhabricatorTriggeredBuild() {
  return params.PHID != null && params.PHID != ""
}

def codeReviewPreBuild = {
  phabConnector.sendBuildStatus('work')
  addBuildInfo()
}

def codeReviewPostBuild = {
  if (currentBuild.result == "SUCCESS") {
    phabConnector.sendBuildStatus('pass')
  } else {
    phabConnector.sendBuildStatus('fail')
  }

  if (DEPLOY_URL != "") {
    // Since it's only hosted internally add basic auth info.
    // This is obviously not secure, but we plan to make this public soon anyways.
    def withAuthHeader = DEPLOY_URL.replace('https://', "https://pixie:${params.SITE_PASSWD}@")
    phabConnector.addArtifactLink(withAuthHeader,
                                  'customer-docs.uri', 'Customer Docs')
  }

  if (DEPLOY_LOGS != "") {
    phabConnector.addArtifactLink(DEPLOY_LOGS,
                                  'customer-docs-logs.uri', 'Netlify Logs')
  }

}

def postBuildActions = {
  if (isPhabricatorTriggeredBuild()) {
    codeReviewPostBuild()
  }

  // Master runs are triggered by Phabricator, but we still want
  // notifications on failure.
  if (!isPhabricatorTriggeredBuild()) {
    sendSlackNotification()
  }
}

if (isPhabricatorTriggeredBuild()) {
  codeReviewPreBuild()
}

node {
  currentBuild.result = 'SUCCESS'
  deleteDir()
  try {
    stage('Build & Deploy') {
      checkout scm

      docker.image("nikolaik/python-nodejs:python3.8-nodejs10").inside() {
        sh """
          yarn install
          ./node_modules/.bin/netlify build
          ./node_modules/.bin/netlify deploy --site=${params.NETLIFY_SITE_ID} \
             --auth=${params.NETLIFY_TOKEN} --json > site_deploy.json
        """
        def deployInfo = readJSON file: 'site_deploy.json'
        DEPLOY_LOGS = deployInfo['logs']
        DEPLOY_URL = deployInfo['deploy_url']
      }
    }
  } catch(err) {
    currentBuild.result = 'FAILURE'
    echo "Exception thrown:\n ${err}"
    echo "Stacktrace:"
    err.printStackTrace()
  }
  postBuildActions()
}
