import React from "react";

export const Reference = () => (
  <>
    <div className="content">
      <h3>JDL Reference</h3>
      <h2>Application Declaration</h2>
      <hr />
      <div className="highlighter-rouge">
        <code className="highlight">
          <pre>
            application &#123; <br />
            &nbsp;&nbsp;config &#123; <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&lt;option name&gt; &lt;option value&gt;
            <br />
            &nbsp;&nbsp;&#125;
            <br />
            &nbsp;&nbsp;[entities &lt;application entity list&gt;]
            <br />
            &nbsp;&nbsp;[&lt;options&gt;]
            <br />
            &#125;
            <br />
          </pre>
        </code>
      </div>
      <ul className="options">
        <li>
          <p>
            Application configuration keys/values are specified under config
            (which must be inside application)
          </p>
        </li>
        <li>
          <p>
            There can be 0, 1 or any application option as you want (provided
            they are valid)
          </p>
        </li>
        <li>
          <p>
            Entities that will be generated inside the application are listed
            via entities, this is the recommended way to generate entities in
            applications.
          </p>
        </li>
        <li>
          <p>
            The <kbd>entities</kbd> keyword is optional: you can omit it, but
            every entity in the JDL file will be generated inside the
            application
          </p>
        </li>
      </ul>
      <p>
        Full documentation with possible options can be found{" "}
        <a
          href="https://www.jhipster.tech/jdl/applications"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </p>
      <h2>Entity Declaration</h2>
      <hr />
      <div className="highlighter-rouge">
        <code className="highlight">
          <pre>
            entity &lt;entity name&gt; &#123; <br />
            &nbsp;&nbsp;&lt;field name&gt; &lt;type&gt;[&lt;validation&gt;*]{" "}
            <br />
            &#125;
          </pre>
        </code>
      </div>
      <ul className="options">
        <li>
          <p>
            <code className="highlighter-rouge">&lt;entity name&gt;</code> is
            the name of the entity,
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">&lt;field name&gt;</code> the
            name of one field of the entity,
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">&lt;type&gt;</code> the JHipster
            supported type of the field,
          </p>
        </li>
        <li>
          <p>
            and as an option{" "}
            <code className="highlighter-rouge">&lt;validation&gt;</code> the
            validations for the field.
          </p>
        </li>
      </ul>
      <p>
        Full documentation with possible options can be found here{" "}
        <a
          href="https://www.jhipster.tech/jdl/entities-fields"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </p>
      <p>
        The possible types and validations are those described{" "}
        <a
          href="https://www.jhipster.tech/jdl/entities-fields#field-types-and-validations"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        , if the validation requires a value, simply add{" "}
        <code className="highlighter-rouge">(&lt;value&gt;)</code> right after
        the name of the validation.
      </p>
      <h2>Enum Declaration</h2>
      <hr />
      <div className="highlighter-rouge">
        <code className="highlight">
          <pre>
            enum &lt;enum name&gt; &#123; <br />
            &nbsp;&nbsp;&lt;enum values&gt; <br />
            &#125;
          </pre>
        </code>
      </div>
      <ul className="options">
        <li>
          <p>
            <code className="highlighter-rouge">&lt;enum name&gt;</code> is the
            name of the enum,
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">&lt;enum values&gt;</code> the
            comma separated values in uppercase
          </p>
        </li>
      </ul>
      <p>
        Full documentation with possible options can be found here{" "}
        <a
          href="https://www.jhipster.tech/jdl/enums"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </p>
      <h2>Relationship Declaration</h2>
      <hr />
      <div className="highlighter-rouge">
        <pre className="highlight">
          relationship &lt;type&gt; &#123;
          <br />
          &nbsp;&nbsp;&lt;from entity&gt;[&#123;&lt;relationship name&gt;&#125;]
          <br />
          &nbsp;&nbsp;to
          <br />
          &nbsp;&nbsp;&lt;to entity&gt;[&#123;&lt;relationship name&gt;&#125;]
          <br />
          &#125;
        </pre>
      </div>
      <ul className="options">
        <li>
          <p>
            <code className="highlighter-rouge">&lt;type&gt;</code> is the type
            of your relationship (OneToMany | ManyToOne | OneToOne | ManyToMany)
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">&lt;from entity&gt;</code> is
            the name of the entity owner of the relationship,
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">&lt;to entity&gt;</code> is the
            name of the entity where the relationship goes to,
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">&lt;relationship name&gt;</code>{" "}
            is the name of the relationship in the entity.
          </p>
        </li>
      </ul>
      <p>
        Full documentation with possible options can be found here{" "}
        <a
          href="https://www.jhipster.tech/jdl/relationships"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </p>
      <h2>Option Declaration</h2>
      <hr />
      <p>
        It is possible to declare some of the supported options via JDL,
        supported options are:
      </p>
      <ul className="options">
        <li>
          <p>
            <code className="highlighter-rouge">paginate</code> enable
            pagination for the entity with pager | pagination | infinite-scroll
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">service</code> enable service
            layer for the entity with serviceClass | serviceImpl
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">dto</code> enable DTO for the
            entity with Mapstruct
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">skipClient</code> skip client
            side code for entity
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">skipServer</code> skip server
            side code for entity
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">angularSuffix</code> add a
            suffix to angular route names
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">microservice</code> specify the
            app name of entity from another microservice
          </p>
        </li>
        <li>
          <p>
            <code className="highlighter-rouge">search</code> specify search
            option for entity from another microservice
          </p>
        </li>
      </ul>
      <p>
        Full documentation with possible options can be found here{" "}
        <a
          href="https://www.jhipster.tech/jdl/options"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
      </p>
      <p>
        Refer{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.jhipster.tech/jdl/"
        >
          JDL
        </a>{" "}
        documentation for more details.
      </p>
    </div>
  </>
);
