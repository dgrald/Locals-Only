package controllers

import akka.stream.Materializer
import models._
import models.services._
import org.mockito.Mockito._
import org.scalatest.concurrent.ScalaFutures
import org.scalatest.mock.MockitoSugar
import org.scalatestplus.play.{ OneAppPerSuite, PlaySpec }
import play.api.libs.json._
import play.api.test.Helpers._
import play.api.test._
import utils.Constants

import scala.concurrent.Future

/**
 * Created by dylangrald on 11/2/16.
 */
class StashControllerSpec extends PlaySpec with MockitoSugar with OneAppPerSuite with ScalaFutures {

  implicit lazy val materializer: Materializer = app.materializer

  def getStash(location: Location, jsValue: JsValue): Stash = {
    val name = (jsValue \ "name").get.validate[String].get
    val id = (jsValue \ "_id").get.validate[String].get
    val userID = (jsValue \ "userID").get.validate[String].get
    Stash(id, userID, name, location)
  }

  def getPointStash(jsValue: JsValue): Stash = {
    val coordinates = (jsValue \ "location" \ "geometry" \ "coordinates").get.validate[List[Double]].get
    val pointLocation = PointLocation(coordinates.head, coordinates.last)
    getStash(pointLocation, jsValue)
  }

  def getLineStash(jsValue: JsValue): Stash = {
    val coordinates = (jsValue \ "location" \ "geometry" \ "coordinates").get.validate[List[List[Double]]].get
    val lineLocation = LineLocation(coordinates.map(e => (e.head, e.last)))
    getStash(lineLocation, jsValue)
  }

  def getPolygonStash(jsValue: JsValue): Stash = {
    val coordinates = (jsValue \ "location" \ "geometry" \ "coordinates").get.validate[List[List[Double]]].get
    val polygonLocation = PolygonLocation(coordinates.map(e => (e.head, e.last)))
    getStash(polygonLocation, jsValue)
  }

  def setUpController(): (StashController, StashStore, JsonConverter) = {
    val stashStore = mock[StashStore]
    val jsonConverter = mock[JsonConverter]
    val controller = new StashController(stashStore, jsonConverter)
    (controller, stashStore, jsonConverter)
  }

  "StashController.index" should {
    val allStashes = List(SomeRandom.pointLocationStash(), SomeRandom.pointLocationStash())
    "return the stashes from the StashStore" in {
      val (controller, stashStore, _) = setUpController()
      when(stashStore.getStashes) thenReturn Future.successful(allStashes)

      val actual = controller.index(FakeRequest())

      status(actual) mustBe OK
      val jsonValidation = contentAsJson(actual)
      val first = getPointStash(jsonValidation(0).get)
      val second = getPointStash(jsonValidation(1).get)
      List(first, second) mustEqual allStashes
    }
  }

  "StashController.getStash" should {
    val id = SomeRandom.uuidString()

    "get the specified stash when it exists" in {
      val stash = SomeRandom.lineLocationStash()
      val (controller, stashStore, _) = setUpController()
      when(stashStore.getStash(id)) thenReturn Future.successful(Some(stash))

      val actual = controller.getStash(id)(FakeRequest())

      status(actual) mustBe OK
      getLineStash(contentAsJson(actual)) mustEqual stash
    }

    "return 404 when there is no stash that exists" in {
      val (controller, stashStore, _) = setUpController()
      when(stashStore.getStash(id)) thenReturn Future.successful(None)

      val actual = controller.getStash(id)(FakeRequest())

      status(actual) mustBe NOT_FOUND
    }
  }

  "StashController.addStash" should {
    val newStashPointLocation = SomeRandom.pointLocation()
    val newStash = SomeRandom.stash(newStashPointLocation)
    "add a new stash to the StashStore" in {
      val (controller, stashStore, jsonConverter) = setUpController()
      when(stashStore.addStash(newStash)) thenReturn Future.successful(newStash)
      val jsonBody = SomeRandom.jsonObj()
      val request = FakeRequest(POST, "/stash").withJsonBody(jsonBody)
      when(jsonConverter.getStashFromRequestBody(jsonBody)) thenReturn Some(newStash)

      val actual = controller.addStash(request)

      status(actual) mustBe OK
      val responseStash = getPointStash(contentAsJson(actual))
      responseStash mustEqual newStash
    }

    "return bad request when given improper point location json" in {
      val (controller, _, jsonConverter) = setUpController()
      val requestJson = SomeRandom.jsonObj()
      when(jsonConverter.getStashFromRequestBody(requestJson)) thenReturn None
      val request = FakeRequest(POST, "/stash").withJsonBody(requestJson)

      val actual = controller.addStash(request)

      status(actual) mustBe BAD_REQUEST
      contentAsString(actual).replaceAll("\\s", "") mustEqual Json.prettyPrint(requestJson).replaceAll("\\s", "")
    }

    "return bad request when given no json" in {
      val (controller, _, _) = setUpController()
      val request = FakeRequest(POST, "/stash").withTextBody("")

      val actual = controller.addStash(request)

      status(actual) mustBe BAD_REQUEST
      contentAsString(actual) mustEqual Constants.noValidJsonMessage
    }
  }

  "StashController.updateStash" should {
    "update the given stash" in {
      val (controller, stashStore, jsonConverter) = setUpController()
      val jsonBody = SomeRandom.jsonObj()
      val request = FakeRequest(PUT, "/stash").withJsonBody(jsonBody)
      val stash = SomeRandom.pointLocationStash()
      val updatedStash = SomeRandom.pointLocationStash()
      when(jsonConverter.getStashFromRequestBody(jsonBody)) thenReturn Some(stash)
      when(stashStore.updateStash(stash)) thenReturn Future.successful(updatedStash)

      val actual = controller.updateStash(request)

      status(actual) mustBe OK
      val responseStash = getPointStash(contentAsJson(actual))
      responseStash mustEqual updatedStash
    }

    "return bad request when given improper point location json" in {
      val (controller, _, jsonConverter) = setUpController()
      val requestJson = SomeRandom.jsonObj()
      when(jsonConverter.getStashFromRequestBody(requestJson)) thenReturn None
      val request = FakeRequest(PUT, "/stash").withJsonBody(requestJson)

      val actual = controller.updateStash(request)

      status(actual) mustBe BAD_REQUEST
      contentAsString(actual).replaceAll("\\s", "") mustEqual Json.prettyPrint(requestJson).replaceAll("\\s", "")
    }

    "return bad request when given no json" in {
      val (controller, _, _) = setUpController()
      val request = FakeRequest(PUT, "/stash").withTextBody("")

      val actual = controller.updateStash(request)

      status(actual) mustBe BAD_REQUEST
      contentAsString(actual) mustEqual Constants.noValidJsonMessage
    }
  }
}
