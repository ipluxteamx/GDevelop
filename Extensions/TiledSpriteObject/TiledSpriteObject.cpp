/**

GDevelop - Tiled Sprite Extension
Copyright (c) 2012-2016 Victor Levasseur (victorlevasseur01@orange.fr)
Copyright (c) 2014-2016 Florian Rival (Florian.Rival@gmail.com)
This project is released under the MIT License.
*/

#if defined(GD_IDE_ONLY) && !defined(GD_NO_WX_GUI)
#include <wx/bitmap.h> //Must be placed first, otherwise we get errors relative to "cannot convert 'const TCHAR*'..." in wx/msw/winundef.h
#include <wx/panel.h>
#endif
#include "TiledSpriteObject.h"
#include <SFML/Graphics.hpp>
#include "GDCore/Tools/Localization.h"
#include "GDCpp/Project/Object.h"
#include "GDCpp/Project/Project.h"
#include "GDCpp/RuntimeScene.h"
#include "GDCpp/RuntimeGame.h"
#include "GDCpp/ImageManager.h"
#include "GDCpp/FontManager.h"
#include "GDCpp/Project/InitialInstance.h"
#include "GDCpp/Polygon2d.h"
#include "GDCpp/Serialization/SerializerElement.h"
#include "GDCpp/CommonTools.h"

#if defined(GD_IDE_ONLY)
#include "GDCore/IDE/Dialogs/MainFrameWrapper.h"
#include "GDCore/IDE/Project/ArbitraryResourceWorker.h"
#include "TiledSpriteObjectEditor.h"
#endif

using namespace std;

TiledSpriteObject::TiledSpriteObject(gd::String name_) :
    Object(name_),
    textureName(""),
    width(32),
    height(32)
{
}

void TiledSpriteObject::DoUnserializeFrom(gd::Project & project, const gd::SerializerElement & element)
{
    textureName = element.GetStringAttribute("texture");
    width = element.GetDoubleAttribute("width", 128);
    height = element.GetDoubleAttribute("height", 128);
}

#if defined(GD_IDE_ONLY)
void TiledSpriteObject::DoSerializeTo(gd::SerializerElement & element) const
{
    element.SetAttribute("texture", textureName);
    element.SetAttribute("width", width);
    element.SetAttribute("height", height);
}

void TiledSpriteObject::LoadResources(gd::Project & project, gd::Layout & layout)
{
    texture = project.GetImageManager()->GetSFMLTexture(textureName);
}
#endif

namespace
{
    sf::Vector2f RotatePoint(sf::Vector2f point, float angle)
    {
        float t,
              cosa = cos(-angle),
              sina = sin(-angle); //We want a clockwise rotation

        t = point.x;
        point.x = t*cosa + point.y*sina;
        point.y = -t*sina + point.y*cosa;

        return point;
    }
}

RuntimeTiledSpriteObject::RuntimeTiledSpriteObject(RuntimeScene & scene, const TiledSpriteObject & tiledSpriteObject) :
    RuntimeObject(scene, tiledSpriteObject),
    width(32),
    height(32),
    xOffset(0),
    yOffset(),
    angle(0)
{
    SetWidth(tiledSpriteObject.GetWidth());
    SetHeight(tiledSpriteObject.GetHeight());

    textureName = tiledSpriteObject.textureName;
    ChangeAndReloadImage(textureName, scene);
}

void RuntimeTiledSpriteObject::ChangeAndReloadImage(const gd::String &txtName, const RuntimeScene &scene)
{
    textureName = txtName;
    texture = scene.GetImageManager()->GetSFMLTexture(textureName);
}

/**
 * Render object at runtime
 */
bool RuntimeTiledSpriteObject::Draw( sf::RenderTarget& window )
{
    //Don't draw anything if hidden
    if ( hidden ) return true;
    if(!texture) return true;

    sf::Vector2f centerPosition = sf::Vector2f(GetX()+GetCenterX(),GetY()+GetCenterY());
    float angleInRad = angle*3.14159/180.0;
    texture->texture.setRepeated(true);
    sf::Vertex vertices[] = {
        sf::Vertex( centerPosition+RotatePoint(sf::Vector2f(-width/2,-height/2), angleInRad), sf::Vector2f(0+xOffset,0+yOffset)),
        sf::Vertex( centerPosition+RotatePoint(sf::Vector2f(+width/2,-height/2), angleInRad), sf::Vector2f(width+xOffset,0+yOffset)),
        sf::Vertex( centerPosition+RotatePoint(sf::Vector2f(-width/2,+height/2), angleInRad), sf::Vector2f(0+xOffset, height+yOffset)),
        sf::Vertex( centerPosition+RotatePoint(sf::Vector2f(+width/2,+height/2), angleInRad), sf::Vector2f(width+xOffset, height+yOffset))
    };

    window.draw(vertices, 4, sf::TrianglesStrip, &texture->texture);
    texture->texture.setRepeated(false);

    return true;
}

#if defined(GD_IDE_ONLY)
sf::Vector2f TiledSpriteObject::GetInitialInstanceDefaultSize(gd::InitialInstance & instance, gd::Project & project, gd::Layout & layout) const
{
    return sf::Vector2f(width,height);
}

/**
 * Render object at edittime
 */
void TiledSpriteObject::DrawInitialInstance(gd::InitialInstance & instance, sf::RenderTarget & renderTarget, gd::Project & project, gd::Layout & layout)
{
    if(!texture) return;

    float width = instance.HasCustomSize() ? instance.GetCustomWidth() : GetInitialInstanceDefaultSize(instance, project, layout).x;
    float height = instance.HasCustomSize() ? instance.GetCustomHeight() : GetInitialInstanceDefaultSize(instance, project, layout).y;
    float xOffset = 0;
    float yOffset = 0;

    sf::Vector2f centerPosition = sf::Vector2f(instance.GetX()+width/2, instance.GetY()+height/2);
    float angleInRad = instance.GetAngle()*3.14159/180.0;
    texture->texture.setRepeated(true);
    sf::Vertex vertices[] = {
        sf::Vertex( centerPosition+RotatePoint(sf::Vector2f(-width/2,-height/2), angleInRad), sf::Vector2f(0+xOffset,0+yOffset)),
        sf::Vertex( centerPosition+RotatePoint(sf::Vector2f(+width/2,-height/2), angleInRad), sf::Vector2f(width+xOffset,0+yOffset)),
        sf::Vertex( centerPosition+RotatePoint(sf::Vector2f(-width/2,+height/2), angleInRad), sf::Vector2f(0+xOffset, height+yOffset)),
        sf::Vertex( centerPosition+RotatePoint(sf::Vector2f(+width/2,+height/2), angleInRad), sf::Vector2f(width+xOffset, height+yOffset))
    };

    renderTarget.draw(vertices, 4, sf::TrianglesStrip, &texture->texture);
    texture->texture.setRepeated(false);
}

void TiledSpriteObject::ExposeResources(gd::ArbitraryResourceWorker & worker)
{
    worker.ExposeImage(textureName);
}

bool TiledSpriteObject::GenerateThumbnail(const gd::Project & project, wxBitmap & thumbnail) const
{
#if !defined(GD_NO_WX_GUI)
    thumbnail = wxBitmap("CppPlatform/Extensions/TiledSpriteIcon24.png", wxBITMAP_TYPE_ANY);
#endif

    return true;
}

void TiledSpriteObject::EditObject( wxWindow* parent, gd::Project & game, gd::MainFrameWrapper & mainFrameWrapper )
{
#if !defined(GD_NO_WX_GUI)
    TiledSpriteObjectEditor dialog(parent, game, *this, mainFrameWrapper);
    dialog.ShowModal();
#endif
}

void RuntimeTiledSpriteObject::GetPropertyForDebugger(std::size_t propertyNb, gd::String & name, gd::String & value) const
{
    if      ( propertyNb == 0 ) {name = _("Width");       value = gd::String::From(width);}
    else if ( propertyNb == 1 ) {name = _("Height");       value = gd::String::From(height);}
    else if ( propertyNb == 2 ) {name = _("Angle");       value = gd::String::From(angle);}
}

bool RuntimeTiledSpriteObject::ChangeProperty(std::size_t propertyNb, gd::String newValue)
{
    if      ( propertyNb == 0 ) {width = newValue.To<float>();}
    else if ( propertyNb == 1 ) {height = newValue.To<float>();}
    else if ( propertyNb == 2 ) {angle = newValue.To<float>();}

    return true;
}

std::size_t RuntimeTiledSpriteObject::GetNumberOfProperties() const
{
    return 3;
}
#endif
