package models.services

import javax.inject.Inject

import models.Stash
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json._
import play.modules.reactivemongo.ReactiveMongoApi
import reactivemongo.api.{ Cursor, ReadPreference }
import reactivemongo.play.json.collection.JSONCollection

import scala.concurrent.Future

/**
 * Created by dylangrald on 11/2/16.
 */
class StashStore @Inject() (val reactiveMongoApi: ReactiveMongoApi) {

  implicit val locationFormat: OFormat[Stash] = new OFormat[Stash] {
    override def writes(o: Stash): JsObject = Json.obj("_id" -> o._id, "stash" -> Stash.stashWrites.writes(o))

    override def reads(json: JsValue): JsResult[Stash] = Stash.stashReads.reads((json \ "stash").get)
  }

  implicit val jsonFormat: OWrites[JsObject] = new OWrites[JsObject] {
    override def writes(o: JsObject): JsObject = o
  }

  val locationCollection = reactiveMongoApi.database.map(d => d.collection[JSONCollection]("stashes"))

  val handler: Cursor.ErrorHandler[List[Stash]] =
    { (last: List[Stash], error: Throwable) =>
      println(s"Encounter error: $error")

      if (last.isEmpty) { // continue, skip error if no previous value
        Cursor.Cont(last)
      } else Cursor.Fail(error)
    }

  val readPreference: ReadPreference = ReadPreference.nearest

  def addStash(stash: Stash): Future[Stash] = {
    locationCollection.flatMap(l => l.insert[Stash](stash).map(_ => stash))
  }

  def getStashes(): Future[Seq[Stash]] = {
    locationCollection.flatMap(l => l.find(Json.obj()).cursor[Stash]().collect[List](-1, handler))
  }

  def getStash(id: String): Future[Option[Stash]] = {
    locationCollection.flatMap(l => l.find(Json.obj("_id" -> id)).cursor[Stash](readPreference).collect[List](-1, handler).map {
      case List(matchingStash) => Some(matchingStash)
      case _ => None
    })
  }

  def deleteStash(id: String): Future[Boolean] = {
    locationCollection.flatMap(l => l.findAndRemove(Json.obj("_id" -> id)).map(result => true))
  }

  def updateStash(updatedStash: Stash): Future[Stash] = {
    locationCollection.flatMap(l => l.findAndUpdate(Json.obj("_id" -> updatedStash._id), updatedStash).map(_ => updatedStash))
  }
}