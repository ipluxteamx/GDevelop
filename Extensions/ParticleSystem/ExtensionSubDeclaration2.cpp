/**

GDevelop - Particle System Extension
Copyright (c) 2010-2016 Florian Rival (Florian.Rival@gmail.com)
This project is released under the MIT License.
*/

#include "GDCore/Extensions/PlatformExtension.h"
#include "GDCore/Tools/Localization.h"
#include "GDCore/Extensions/Metadata/MultipleInstructionMetadata.h"

#include "Extension.h"
#include "ParticleEmitterObject.h"

/**
 * Declare some actions and conditions of the particle emitter
 */
void ExtensionSubDeclaration2(gd::ObjectMetadata& obj) {
  obj.AddAction("ParticleColor1",
                _("Start color"),
                _("Modify start color of particles."),
                _("Change particles start color of _PARAM0_ to _PARAM1_"),
                _("Common"),
                "CppPlatform/Extensions/particleSystemicon24.png",
                "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .AddParameter("color", _("Start color"));

  obj.AddAction("ParticleColor2",
                _("End color"),
                _("Modify end color of particles."),
                _("Change particles end color of _PARAM0_ to _PARAM1_"),
                _("Common"),
                "CppPlatform/Extensions/particleSystemicon24.png",
                "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .AddParameter("color", _("End color"));

  obj.AddAction(
         "ParticleRed1",
         _("Start color red component"),
         _("Modify the start color red component."),
         _("the start color red component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardOperatorParameters("number");

  obj.AddCondition(
         "ParticleRed1",
         _("Start color red component"),
         _("Compare the start color red component."),
         _("the start color red component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardRelationalOperatorParameters("number");

  obj.AddAction(
         "ParticleRed2",
         _("End color red component"),
         _("Modify the end color red component."),
         _("the end color red component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardOperatorParameters("number");

  obj.AddCondition(
         "ParticleRed2",
         _("End color red component"),
         _("Compare the end color red component."),
         _("the end color red component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardRelationalOperatorParameters("number");

  obj.AddAction(
         "ParticleBlue1",
         _("Start color blue component"),
         _("Modify the start color blue component."),
         _("the start color blue component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardOperatorParameters("number");

  obj.AddCondition(
         "ParticleBlue1",
         _("Start color blue component"),
         _("Compare the start color blue component."),
         _("the start color blue component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardRelationalOperatorParameters("number");

  obj.AddAction(
         "ParticleBlue2",
         _("End color blue component"),
         _("Modify the end color blue component."),
         _("the end color blue component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardOperatorParameters("number");

  obj.AddCondition(
         "ParticleBlue2",
         _("End color blue component"),
         _("Compare the end color blue component."),
         _("the end color blue component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardRelationalOperatorParameters("number");

  obj.AddAction(
         "ParticleGreen1",
         _("Start color green component"),
         _("Modify the start color green component."),
         _("the start color green component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardOperatorParameters("number");

  obj.AddCondition(
         "ParticleGreen1",
         _("Start color green component"),
         _("Compare the start color green component."),
         _("the start color green component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardRelationalOperatorParameters("number");

  obj.AddAction(
         "ParticleGreen2",
         _("End color green component"),
         _("Modify the end color green component."),
         _("the end color green component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardOperatorParameters("number");

  obj.AddCondition(
         "ParticleGreen2",
         _("End color green component"),
         _("Compare the end color green component."),
         _("the end color green component"),
         _("Advanced"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardRelationalOperatorParameters("number");

  obj.AddAction("ParticleSize1",
                _("Start size"),
                _("Modify the particle start size."),
                _("the start size"),
                _("Common"),
                "CppPlatform/Extensions/particleSystemicon24.png",
                "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardOperatorParameters("number");

  obj.AddCondition("ParticleSize1",
                   _("Start size"),
                   _("Compare the particle start size."),
                   _("the start size"),
                   _("Common"),
                   "CppPlatform/Extensions/particleSystemicon24.png",
                   "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardRelationalOperatorParameters("number");

  obj.AddAction("ParticleSize2",
                _("End size"),
                _("Modify the particle end size."),
                _("the end size"),
                _("Common"),
                "CppPlatform/Extensions/particleSystemicon24.png",
                "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardOperatorParameters("number");

  obj.AddCondition("ParticleSize2",
                   _("End size"),
                   _("Compare the particle end size."),
                   _("the end size"),
                   _("Common"),
                   "CppPlatform/Extensions/particleSystemicon24.png",
                   "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardRelationalOperatorParameters("number");

  obj.AddAction("ParticleAlpha1",
                _("Start opacity"),
                _("Modify the start opacity of particles."),
                _("the start opacity"),
                _("Common"),
                "CppPlatform/Extensions/particleSystemicon24.png",
                "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardOperatorParameters("number");

  obj.AddCondition(
         "ParticleAlpha1",
         _("Start opacity"),
         _("Compare the start opacity of particles."),
         _("the start opacity"),
         _("Common"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardRelationalOperatorParameters("number");

  obj.AddAction("ParticleAlpha2",
                _("End opacity"),
                _("Modify the end opacity of particles."),
                _("the end opacity"),
                _("Common"),
                "CppPlatform/Extensions/particleSystemicon24.png",
                "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardOperatorParameters("number");

  obj.AddCondition(
         "ParticleAlpha2",
         _("End opacity"),
         _("Compare the end opacity of particles."),
         _("the end opacity"),
         _("Common"),
         "CppPlatform/Extensions/particleSystemicon24.png",
         "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardRelationalOperatorParameters("number");

  obj.AddCondition("NoMoreParticles",
                   _("No more particles"),
                   _("Check if the object does not emit particles "
                     "any longer, so as to destroy it for example."),
                   _("_PARAM0_ does not emit any longer"),
                   _("Common"),
                   "CppPlatform/Extensions/particleSystemicon24.png",
                   "CppPlatform/Extensions/particleSystemicon16.png")
      .AddParameter("object", _("Object"), "ParticleEmitter");

  obj.AddExpressionAndConditionAndAction(
          "number",
          "ParticleRotationMinSpeed",
          _("Particle rotation min speed"),
          _("the minimum rotation speed of the particles"),
          _("the particles minimum rotation speed"),
          _("Common"),
          "CppPlatform/Extensions/particleSystemicon24.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardParameters("number")
      .MarkAsAdvanced()
      .SetFunctionName("setParticleRotationMinSpeed")
      .SetGetter("getParticleRotationMinSpeed");

  obj.AddExpressionAndConditionAndAction(
          "number",
          "ParticleRotationMaxSpeed",
          _("Particle rotation max speed"),
          _("the maximum rotation speed of the particles"),
          _("the particles maximum rotation speed"),
          _("Common"),
          "CppPlatform/Extensions/particleSystemicon24.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardParameters("number")
      .MarkAsAdvanced()
      .SetFunctionName("setParticleRotationMaxSpeed")
      .SetGetter("getParticleRotationMaxSpeed");

  obj.AddExpressionAndConditionAndAction(
          "number",
          "MaxParticlesCount",
          _("Number of displayed particles"),
          _("the maximum number of displayed particles"),
          _("the maximum number of displayed particles"),
          _("Common"),
          "CppPlatform/Extensions/particleSystemicon24.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardParameters("number")
      .SetFunctionName("setMaxParticlesCount")
      .SetGetter("getMaxParticlesCount");

  obj.AddExpressionAndConditionAndAction(
          "boolean",
          "AdditiveRendering",
          _("Activate particles additive rendering"),
          _("the particles additive rendering is activated"),
          _("displaying particles with additive rendering activated"),
          _("Common"),
          "CppPlatform/Extensions/particleSystemicon24.png")
      .AddParameter("object", _("Object"), "ParticleEmitter")
      .UseStandardParameters("boolean")
      .MarkAsAdvanced()
      .SetFunctionName("setAdditiveRendering")
      .SetGetter("getAdditiveRendering");

}
